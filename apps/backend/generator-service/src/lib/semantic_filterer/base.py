from abc import ABC, abstractmethod
from lib.logger import initLogger
import pandas as pd
import faiss
import numpy as np
from lib.logger import initLogger
from lib.embedder.base import Embedder
from domain.shared.place_data import PlaceData

class SemanticFilterer(ABC):
    @abstractmethod
    def filter(self, desc: str, data: list[PlaceData]) -> list[str]:
        pass

class SemanticFiltererImpl(SemanticFilterer):
    def __init__(self, embedder: Embedder):
        self.embedder = embedder

    # returns a list of nodeIDs
    def filter(self, desc: str, data: list[PlaceData]) -> list[str]:
        logger = initLogger("SemanticFiltererImpl.filter()")
        logger.info("Filtering...")
        logger.info(f"PROMPT: {desc}")

        for guy in data:
            print("JUST A TEST", guy.tags.get("name", ""))

        df = pd.DataFrame(data)

        # Apply the function to create a new column with combined features
        df['combined_features'] = df.apply(combine_features, axis=1) 

        # Define vector dimensionality (3072 dimentions)
        dim = 1024

        # Create a FAISS index for L2 distance searching
        index = faiss.IndexFlatL2(dim)

        # Initialize an array to hold the vector representations of the combined features
        # Shape: (number of locations, dimension)
        # This array `X` is of shape `numLoc` by `dimension`, filled with 0s.
        X = np.zeros((len(df['combined_features']), dim), dtype=np.float32)

        # Iterate through each combined feature representation in the DataFrame
        # NOTE: `_repr` is Python's conventional way of saying "string representation".
        # embed just the fields we are interested in
        logger.info("Embedding...")
        for i, _repr in enumerate(df['combined_features']):
            # Print progress every 10 locations processed
            if i % 10 == 0:
                print("Processed {}/{}".format(i, len(df['combined_features']))) 

            embedding_list = self.embedder.embed(_repr)

            # Store generated embedding in numpy array `X`
            X[i] = np.array(embedding_list)

        # Add embeddings to the FAISS Index
        index.add(X)

        # Save the FAISS Index to a file for future use
        faiss.write_index(index, "index")

        # Optionally, you can load the index from the file in subsequent runs
        # index = faiss.read_index("index")
        
        embedding_list = self.embedder.embed(desc)
        embedding = np.array(embedding_list).reshape(1, -1)

        # Perform a search in the FAISS index for the top 5 similar locations
        # ie. those in the index that match our input embedding the most
        distances, indices = index.search(embedding, 5)
        print(distances, indices)

        # Display the results in a readable format
        dateideas = []
        print("\nTop 5 date ideas:")
        for i in range(len(indices[0])):
            idx = indices[0][i]
            row = df.iloc[idx]

            row_dict = row.to_dict()
            node_id = row_dict["id"]
            dateideas.append(node_id)
        
        return dateideas
    
def initSemanticFilterer(embedder: Embedder) -> SemanticFilterer:
    return SemanticFiltererImpl(embedder)

# HELPER FUNCTIONS    
def combine_features(row):
    '''
    Combines key features of a location into a single string.

    Parameters: row(pd.Series): A row from the DataFrame representing a single location.

    Returns:
    str: A combined string of key location features. These are the main features we care about.
    '''
    # return f"""
    # latitude: {row.get("lat", 0.0)},
    # longitude: {row.get("lon", 0.0)},
    # amenity: {row.get("amenity", "")},
    # name: {row.get("name", "")},
    # street: {row.get("street", "")},
    # city: {row.get("city", "")},
    # """

    return f"""
    latitude: {row.get("lat", 0.0)},
    longitude: {row.get("lon", 0.0)},
    tags: {row.get("tags", {})}
    """

# def embed(input: str) -> list[float]:
#     logger = initLogger("generator.ollama_generator.embed()")
#     logger.info("EMBEDDING...")
#     HF_TOKEN = os.getenv("HUGGINGFACE_TOKEN")
#     PROVIDER = "hf-inference"
#     MODEL = "intfloat/multilingual-e5-large-instruct"
#     # logger.info("Embedding...")

#     client = InferenceClient(
#         provider=PROVIDER,
#         api_key=HF_TOKEN,
#     )

#     result = client.feature_extraction(
#         input,
#         model=MODEL,
#     )
#     return result