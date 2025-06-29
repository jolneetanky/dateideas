from abc import ABC, abstractmethod
from domain.resource.message import JobQueueConsumedMessage
from domain.shared.job import Status
from repository.job_repo import JobRepo
from repository.result_repo import ResultRepo
from lib.logger import initLogger
import overpy
from urllib.parse import quote
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
    api = overpy.Overpass()
    # NOTE: in overpass, we can limit our search to an area + bounding box (so that we don't get results from all over the world.)
    result = api.query(f"""
                       area["name:en"={area}]->.a;
                       node(area.a);
                       out;
                       """)

    for node in result.get_nodes():
        formatted_node = {
            "id": node.id,
            "lat": node.lat,
            "lon": node.lon,
            "tags": node.tags,
            "areas": result.areas,
        }
        res.append(formatted_node)
    logger.info(f"HIII {res}")
    return res

def format_data(data):
    # tags we're interested in
    tag_features = set(['amenity', 'name', 'website'])

    res = []
    for row in data:
        row = row.copy()
        
        dct = {
            "name": row['tags'].get('name', ""),
            "street": row['tags'].get('addr:street', ""),
            "city": row['tags'].get('addr:city', ""),
            "house_number": row['tags'].get('addr:housenumber', ""),
            "floor": row['tags'].get('addr:floor', ""),
            "unit": row['tags'].get('addr:unit', ""),
        }

        for k, v in dct.items():
            row[k] = v

        query = dct['name']
        if query != "":
            query += f", {dct['street']}"
        formatted_query = quote(query)
        if query == "":
            formatted_query = quote(f"{row['lat']},{row['lon']}")    
        gmaps_link = f"https://google.com/maps/search/?api=1&query={formatted_query}"

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
class Generator(ABC):
    @abstractmethod
    def generate(prompt: str):
        pass

# MOST NAIVE/BASIC ONE:
# 1) input: prompt. based on data set, it gives us entries that fit the prompt.
# hm that is basically a semantic search and will be the same each time. how do i make it fun?
# it will simply feel like google search, eg. "date ideas for 2 near bugis" => and we just get like ["yakiniku go", "fun karaoke"]
# which is super boring! even google can do it

# NEW IDEA:
# based on the prompt, generator generates an actual idea, eg. "Take a nice long walk along the beach. Here are some beaches near bugis: "
# we then use this output & its keywords => query Overpass API to get matching locations.
# User can regenerate so that each time, a different idea is generated. Which is much more fun.

class DateIdeaGenerator(Generator):
    def generate(prompt: str):
        # STEP #1: GENERATE A DATEIDEA
        # Can think of this as a chatgpt wrapper that basically asks chatGPT t ogenerate create dateideas
        # problem for later: this dateidea needs to be constrained by the prompt as well
        # ie. the suggestion should be based on actual available locations around the area..?
        logger = initLogger("DateIdeaGenerator.generate")
        desc = "Take a nice stroll around Orchard Towers to see the lights"
        # STEP #2: USE SEMANTIC FILTERING TO GENERATE A LIST OF LOCATIONS BASED ON THE GENERATED DESC
        return desc
    
# class SemanticFilterer(ABC):
#     @abstractmethod
#     def filter(prompt: str):

#         pass

# class TestFilterer(SemanticFilterer):
#     def filter(prompt: str):
# # flatten tags and see how it goes lol
# # this should be in gatherer service.
#         pass

class Filterer():
    def filter(prompt: str):
        pass

# abstract class
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

        # 1) GENERATE RESULTS. ASSUME IT WORKS AND WE SOMEHOW GET AN ARRAY OF DATEIDEAID.
        # 2) STORE THIS ARRAY OF DATEIDEADB WITH THIS JOBID IN THE RESULTDB.
        # TODO: setup `results` DB
        # self.result_repo.insert_rows(jobid: dateideas_id for id in MOCK_DATEIDEAS_ID)

        # NEED: see what kind of data we can find online (for free!) that we can use to store dateideas.
        # Instead of a DB for now, maybe just use an array that stores rows in the form of a hashmap.

        data = gather_data("Orchard")
        print("DATA", data)
        formatted_data = format_data(data)
        print("FORMATTED DATA", formatted_data)

        generator = DateIdeaGenerator()
        # filterer = SemanticFilterer()
        desc = generator.generate()
        logger.info(f"DESC: {desc}")

        filterer = Filterer()
        res = filterer.filter()
        # semanticFilterer = OllamaGenerator()
        # res = semanticFilterer.generate(desc, formatted_data)
        # print("RES", res)
        # locations = filterer.filter(desc, formatted_data)

        # logger.info(f"DESC: {desc}, LOCATIONS: {locations}")

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