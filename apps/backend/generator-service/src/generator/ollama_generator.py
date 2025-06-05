from generator.base import Generator
import pandas as pd
import faiss
import numpy as np
import requests
from dataclasses import fields
from domain.resource.generated_data import GeneratedData

def combine_features(row):
    '''
    Combines key features of a location into a single string.

    Parameters: row(pd.Series): A row from the DataFrame representing a single location.

    Returns:
    str: A combined string of key location features. These are the main features we care about.
    '''
    return f"""
    Latitude: {row['lat']},
    Longitude: {row['lon']},
    Amenity: {row['amenity']},
    Name: {row['name']},
    Street: {row['street']},
    City: {row['city']},
    """

class OllamaGenerator(Generator):
    def __init__(self):
        pass

    def generate(self, prompt, data) -> list[GeneratedData]:
        # Generate and display recommendations

        df = pd.DataFrame(data)

        # Apply the function to create a new column with combined features
        df['combined_features'] = df.apply(combine_features, axis=1) 

        # Define vector dimensionality (3072 dimentions)
        dim = 3072

        # Create a FAISS index for L2 distance searching
        index = faiss.IndexFlatL2(dim)

        # Initialize an array to hold the vector representations of the combined features
        # Shape: (number of locations, dimension)
        # This array `X` is of shape `numLoc` by `dimension`, filled with 0s.
        X = np.zeros((len(df['combined_features']), dim), dtype=np.float32)

        # Iterate through each combined feature representation in the DataFrame
        # NOTE: `_repr` is Python's conventional way of saying "string representation".
        for i, _repr in enumerate(df['combined_features']):
            # Print progress every 10 locations processed
            if i % 10 == 0:
                print("Processed {}/{}".format(i, len(df['combined_features']))) 
            
            # Send a POST req to the local Llama model API to generate embeddings
            res = requests.post("http://localhost:11434/api/embeddings",
                                json={"model": "llama3.2", # Specify the model to use
                                    "prompt": _repr}) # Provide the combined features as the prompt

            # Extract embedding from API response
            embedding = res.json()['embedding']

            # Store generated embedding in numpy array `X`
            X[i] = np.array(embedding)

        # Add embeddings to the FAISS Index
        index.add(X)

        # Save the FAISS Index to a file for future use
        faiss.write_index(index, "index")

        # Optionally, you can load the index from the file in subsequent runs
        # index = faiss.read_index("index")
        
        # Generate embedding for the input description
        res = requests.post("http://localhost:11434/api/embeddings",
                        json={"model": "llama3.2", "prompt": prompt})
        print(res.json())
        embedding = np.array(res.json()['embedding']).reshape(1, -1)

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

            # convert to DateIdea dataclass
            row_dict = row.to_dict()
            field_names = [f.name for f in fields(GeneratedData)]
            mapped_data = {}
            for key in field_names:
                if key in row_dict:
                    mapped_data[key] = row_dict[key]
            # NOTE: it's okay if `mapped_data` has some missing fields, 
            # because our DateIdea dataclass alr has default values defined
            # Create a DateIdea instance using unpacking
            dateidea = GeneratedData(**mapped_data)

            dateideas.append(dateidea)
        
        return dateideas