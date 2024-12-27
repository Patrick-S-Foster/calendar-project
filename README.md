# How to run the calendar application

1. Ensure that Docker is installed locally (tested with version 27.3.1)
1. Ensure that git is installed locally (tested with version 2.46.2)
1. In an empty directory, run the command `git clone https://github.com/Patrick-S-Foster/calendar-project.git`
1. Inside the cloned repository, ensure that the `main` branch is checked-out by running the command `git switch main`
1. Run the command `docker compose up -d --build`
1. Wait for all containers to be downloaded and initialized (this may take some time)
1. Navigate to http://localhost to view the calendar application
1. To stop the application and remove the docker images from the system, run the command `docker compose down --volumes`

# Notes

As this application uses the [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API), it is recommended to use Chrome, Edge, or Safari as a browser. If another browser is used, such as Firefox, this functionality will not be available.

This application uses Google's [Gemma 2 2B](https://huggingface.co/google/gemma-2-2b) large language model to understand natural language. This model can quickly use a lot of system resources, so if the application is run on a slower/older computer, longer waiting times for natural language processing can be expected.

For ease of use, the `./db_password.txt` and `./db_root_password.txt` files have been included in the repository. In a production environment, these would be included through the use of a pipeline or build system. The contents of these files can be modified to choose different passwords.