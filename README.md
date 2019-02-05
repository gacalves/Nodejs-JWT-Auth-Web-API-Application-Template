# Nodejs Web API Application Template
A Nodejs starter project template for Web API. This template has been configured to user JWT Authentication (username and password).

* This project has compatible with native nodejs features, without transpilers.

How to use:

1 Create your controller clas in controllers folder
 1.1 If you wants a controller that requires authentication inherits from SecuredController class. If your controller doesnt needs authentication it should inherits from BaseController.
2 In controller class, methods that her name starts with an supported HTTP verb will automaticaly mapped to a route.

