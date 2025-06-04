This service basically calls all gatherers we have, calls them to run, then formats the data received, before feeding it into a queue.

This service has 2 main classes: Gatherer and Producer.
Gatherers gather data, and pass it on to the factory-instantiated Producer.

The Producer has a produce(data) method which can act differently depending on how we want it to. For instance if we want the producer's target to be "stdout", the produce(data) method will simply print the output of data.

Producer.produce(data) can also store the data in a queue, if we want it to.
