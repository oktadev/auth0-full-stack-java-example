# Full Stack Java Example with JHipster (React + Spring Boot) 🤓
 
This example app shows you how to create a slick-looking, full-stack, secure application using React, Spring Boot, and JHipster.

Please read [Full Stack Java with React, Spring Boot, and JHipster][blog] to see how this app was created.

**Prerequisites:** 

- [Node.js 14+](https://nodejs.org/)
- [Java 11+](https://sdkman.io)
- [Docker Compose](https://docs.docker.com/compose/install/)
- An [Auth0 Account](https://auth0.com/signup)

> [Auth0](https://auth0.com) is an easy to implement, adaptable authentication and authorization platform. Basically, we make your login box awesome.

* [Getting Started](#getting-started)
* [Links](#links)
* [Help](#help)
* [License](#license)

## Getting Started

To install this example, clone it.

```
git clone https://github.com/oktadev/auth0-full-stack-java-example.git
cd auth0-full-stack-java-example
```

Create a `.auth0.env` file in the root of the project, and fill it with the code below to override the default OIDC settings:

```shell
export SPRING_SECURITY_OAUTH2_CLIENT_PROVIDER_OIDC_ISSUER_URI=https://<your-auth0-domain>/
export SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_OIDC_CLIENT_ID=<your-client-id>
export SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_OIDC_CLIENT_SECRET=<your-client-secret>
export JHIPSTER_SECURITY_OAUTH2_AUDIENCE=https://<your-auth0-domain>/api/v2/
```

You'll need to create a new web application in Auth0 and fill in the `<...>` placeholders before this works. 

### Create an OpenID Connect App on Auth0

Log in to your Auth0 account (or [sign up](https://auth0.com/signup) if you don't have an account). You should have a unique domain like `dev-xxx.eu.auth0.com`. 

Press the **Create Application** button in [Applications section](https://manage.auth0.com/#/applications). Use a name like `JHipster Baby!`, select `Regular Web Applications`, and click **Create**.

Switch to the **Settings** tab and configure your application settings:

- Allowed Callback URLs: `http://localhost:8080/login/oauth2/code/oidc`
- Allowed Logout URLs: `http://localhost:8080/`

Scroll to the bottom and click **Save Changes**.

In the [roles](https://manage.auth0.com/#/roles) section, create new roles named `ROLE_ADMIN` and `ROLE_USER`.

Create a new user account in the [users](https://manage.auth0.com/#/users) section. Click on the **Role** tab to assign the roles you just created to the new account. 

_Make sure your new user's email is verified before attempting to log in!_

Next, head to **Auth Pipeline** > **Rules** > **Create**. Select the `Empty rule` template. Provide a meaningful name like `Group claims` and replace the Script content with the following.

```js
function(user, context, callback) {
  user.preferred_username = user.email;
  const roles = (context.authorization || {}).roles;

  function prepareCustomClaimKey(claim) {
    return `https://www.jhipster.tech/${claim}`;
  }

  const rolesClaim = prepareCustomClaimKey('roles');

  if (context.idToken) {
    context.idToken[rolesClaim] = roles;
  }

  if (context.accessToken) {
    context.accessToken[rolesClaim] = roles;
  }

  callback(null, user, context);
}
```

This code is adding the user's roles to a custom claim (prefixed with `https://www.jhipster.tech/roles`). This claim is mapped to Spring Security authorities in `SecurityUtils.java`.

Click **Save changes** to continue.

**NOTE**: Want to have all these steps automated for you? Vote for [this issue](https://github.com/auth0/auth0-cli/issues/351) in the Auth0 CLI project.

### Run Your JHipster App with Auth0

Set your Auth0 properties in `.auth0.env`, and start the app.

```shell
source .auth0.env
./mvnw
```

_Voilà_ - your full stack app is using Auth0! Open your favorite browser to `http://localhost:8080` and sign-in.

## Links

This example uses the following open source libraries:

* [JHipster](https://www.jhipster.tech)
* [Spring Boot](https://spring.io/projects/spring-boot)
* [Spring Security](https://spring.io/projects/spring-security)

## Help

Please post any questions as comments on the [blog post][blog]. 

## License

Apache 2.0, see [LICENSE](LICENSE).

[blog]: https://auth0.com/blog/full-stack-java-with-react-spring-boot-and-jhipster/
