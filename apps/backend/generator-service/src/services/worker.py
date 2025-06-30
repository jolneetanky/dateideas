from abc import ABC, abstractmethod
from domain.resource.message import JobQueueConsumedMessage
from domain.shared.job import Status
from repository.job_repo import JobRepo
from repository.result_repo import ResultRepo
from lib.logger import initLogger
import overpy
from urllib.parse import quote
from lib.semantic_filterer.base import TestFilterer
from lib.generator.base import DateIdeaGenerator
from generator.ollama_generator import OllamaGenerator

# for now we'll just say every job get's these results.
MOCK_DATEIDEAS_IDS = [
    "1",
    "2",
    "3",
    "4",
    "5",
]

# simulates our data gathering + data cleaning svc, for now store in `dateideas` array.
# dateidea: { address, link, img_link, amenity }
# IDEA: for now treat OSM as our "database" which is the source of all our info. If from there we can gather a list of viable dateideas then that's great.
# start with a subset of locations.

# overpass has many tags, we want a recommender that can recommend us ideas based on tags
# for now we'll just filter by name and country lol eg. orchard, Singapore

# PROBLEM: sometimes the location to filter is found in the prompt. How to process?

# What if we pre-process the prompt and extract locations from there??
# have something to help us do that, then we filter data based on those areas:w
# but for now just assume users is good and just gives us a single location.
def gather_data(area: str):
    res = []
    logger = initLogger("GATHER DATA")
    logger.info("Gathering data...")
    api = overpy.Overpass()
    # NOTE: in overpass, we can limit our search to an area + bounding box (so that we don't get results from all over the world.)
    result = api.query(f"""
                       area["name:en"={area}]->.a;
                       node(area.a)["name"];
                       out center;
                       """)
    
    for node in result.get_nodes():
        res.append(format_node(node))
    return res

# format nodes into a dict
def format_node(node):
    # tags  we're interested in
    # tag_features = set(['amenity', 'name', 'website'])
    logger = initLogger("worker.format_node()")
    # logger.info("Formatting node...")
    
    formatted_node = {
        "id": node.id,
        "lat":  node.lat,
        "lon":  node.lon,
        "tags": node.tags,
        # "name": node.tags.get("name", ""), # for some reason, this is empthyy string even if node.tags contains `name`
        # "tags": node.tags,

        # "name": node['tags'].get('nayeah im thinking if i should flatten the tme', ""),
        # "street": row['tags'].get('addr:street', ""),
        # "city": row['tags'].get('addr:city', ""),
        # "house_number": row['tags'].get('addr:housenumber', ""),
        # "floor": row['tags'].get('addr:floor', ""),
        # "unit": row['tags'].get('addr:unit', ""),
        # "amenity": "",
        # "website": "",
    }

    # flatten tags
    # for k, v in node.tags.items():
    #     formatted_node[k] = v

    return formatted_node

'''
def format_nodes(nodes):
    # tags we're interested in
    tag_features = set(['amenity', 'name', 'website'])

    res = []
    for row in nodes:
        row = row.copy()

        # format address 
        dct = {
            "name": row['tags'].get('name', ""),
            "street": row['tags'].get('addr:street', ""),
            "city": row['tags'].get('addr:city', ""),
            "house_number": row['tags'].get('addr:housenumber', ""),
            "floor": row['tags'].get('addr:floor', ""),
            "unit": row['tags'].get('addr:unit', ""),
            "amenity": "",
            "name": "",
            "website": "",
        }

        for k, v in dct.items():
            row[k] = v

        # get gmaps  link
        name = dct['name']
        if name != "":
            name += f", {dct['street']}"
        formatted_name = quote(name)
        if name == "":
            formatted_name = quote(f"{row['lat']},{row['lon']}")    
        gmaps_link = f"https://google.com/maps/search/?api=1&query={formatted_name}"

        row['link'] = gmaps_link

        # flatten `tags`
        for k, v in row.get('tags', {}).items():
            if k in tag_features:
                row[k] = v
        
        # remove unneeded fields
        row.pop('type', '')
        row.pop('id', '')
        row.pop('tags', {})
        res.append(row)
    
    return res
'''
    
class Worker(ABC):
    def __init__(self, jobRepo: JobRepo, resultRepo: ResultRepo):
        pass

    @abstractmethod
    def generate(self):
        pass

# 2) input: prompt. then worker will give us keywords to query by.
# but i think this is qutie dumb lol
class WorkerImpl(Worker):
    def __init__(self, jobRepo: JobRepo, resultRepo: ResultRepo):
        self.jobRepo = jobRepo
        self.resultRepo = resultRepo

    def generate(self, job_id, prompt, location, budget):
        logger = initLogger("worker.generate")
        logger.info("Genrating...")

        # 1) GENERATE RESULTS. ASSUME IT WORKS AND WE SOMEHOW GET AN ARRAY OF DATEIDEAID.
        # 2) STORE THIS ARRAY OF DATEIDEADB WITH THIS JOBID IN THE RESULTDB.
        # TODO: setup `results` DB
        # self.result_repo.insert_rows(jobid: dateideas_id for id in MOCK_DATEIDEAS_ID)

        # NEED: see what kind of data we can find online (for free!) that we can use to store dateideas.
        # Instead of a DB for now, maybe just use an array that stores rows in the form of a hashmap.

        data = gather_data("Orchard")[:20] # trim to length 20 first
        print("DATA", data)
        # formatted_data = format_data(data)
        # print("FORMATTED DATA", formatted_data)

        generator = DateIdeaGenerator()
        desc = generator.generate(prompt)
        logger.info(f"DESC: {desc}")

        generator = OllamaGenerator()
        res = generator.generate(desc, data)
        logger.info(f"RES: {res}")

        # READ FROM SOME DB OF DATEIDEAS
        # RETURN THEIR IDS

        mock_results = [
            1,
            2,
            4,
        ]
        self.resultRepo.insert_results(job_id, mock_results)

        # simulate job completion
        # generate date ideas...
        # after geneneration, mark job id as either "success" or "error"
        try:
            self.jobRepo.update_job(job_id, Status.SUCCESS)
        except Exception as e:
            logger.error(f"Error updating job id as success: {e}")
            raise # rethrow exception after logging 