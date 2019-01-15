The two commonly used protocols are HTTP request/response with resource APIs (when querying most of all), 

and lightweight asynchronous messaging when communicating updates across multiple microservices.

If your microservice needs to raise an additional action in another microservice, if possible, do not perform that action synchronously and as part of the original microservice request and reply operation. Instead, do it asynchronously (using asynchronous messaging or integration events, queues, etc.)But, as much as possible, do not invoke the action synchronously as part of the original synchronous request and reply operation

 If you're using a synchronous request/response-based communication mechanism, protocols such as HTTP and REST approaches are the most common, especially if you're publishing your services outside the Docker host or microservice cluster. 
 
 If you're communicating between services internally (within your Docker host or microservices cluster), you might also want to use binary format communication mechanisms (like Service Fabric remoting or WCF using TCP and binary format). Alternatively, you can use asynchronous, message-based communication mechanisms such as AMQP.


 API Gateways or Edge services are a way that you can expose an external API for external business units or applications to talk to your application. This external API will require some kind of authentication / authorization in order to connect to your application. The API Gateway handles this and then calls the appropriate microservices to service the external application.