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

# Test data & cases

## Validation that login fails for account that does not exist

1. Navigate to http://localhost/login
1. Enter an email address and password that have not been registered yet, for example, `example@example.com` and `password`
1. Click the "Login" button
1. Check that login has failed by observing a lack of redirect, and an error message reading `Could not log in. Please check your email & password, then try again.`

## Validation that passwords must have at least six characters

1. Navigate to http://localhost/register
1. Enter an email address that has not been registered yet, for example, `example@example.com`
1. Enter the password `Q!1w`
1. Click the "Submit" button
1. Check that registration has failed by observing a lack of redirect, and an error message reading `Passwords must be at least 6 characters.`

## Validation that passwords must have at least one non alphanumeric character

1. Navigate to http://localhost/register
1. Enter an email address that has not been registered yet, for example, `example@example.com`
1. Enter the password `Abcde0`
1. Click the "Submit" button
1. Check that registration has failed by observing a lack of redirect, and an error message reading `Passwords must have at least one non alphanumeric character.`

## Validation that passwords must have at least one digit

1. Navigate to http://localhost/register
1. Enter an email address that has not been registered yet, for example, `example@example.com`
1. Enter the password `Abcde!`
1. Click the "Submit" button
1. Check that registration has failed by observing a lack of redirect, and an error message reading `Passwords must have at least one digit ('0'-'9').`

## Validation that passwords must have at least one lowercase letter

1. Navigate to http://localhost/register
1. Enter an email address that has not been registered yet, for example, `example@example.com`
1. Enter the password `ABCD1!`
1. Click the "Submit" button
1. Check that registration has failed by observing a lack of redirect, and an error message reading `Passwords must have at least one lowercase ('a'-'z').`

## Validation that passwords must have at least one uppercase letter

1. Navigate to http://localhost/register
1. Enter an email address that has not been registered yet, for example, `example@example.com`
1. Enter the password `abcd1!`
1. Click the "Submit" button
1. Check that registration has failed by observing a lack of redirect, and an error message reading `Passwords must have at least one uppercase ('A'-'Z').`

## Validation that accounts can be created

1. Navigate to http://localhost/register
1. Enter an email address that has not been registered yet, for example, `example@example.com`
1. Enter the password `Abcd!1`
1. Click the "Submit" button
1. Check that registration has succeeded by observing a redirect to `http://localhost/login`

## Validation that accounts can not be created with emails that already have an account

1. Navigate to http://localhost/register
1. Successfully register an account
1. Navigate back to http://localhost/register
1. Enter the same account credentials
1. Click the "Submit" button
1. Check that registration has failed by observing a lack of redirect, and an error message reading `Username 'example@example.com' is already taken.` where `example@example.com` is the email address used

## Validation that existing accounts can be logged into

1. Successfully register an account
1. Navigate to http://localhost/login
1. Enter the login credentials used to register the account
1. Click the "Login" button
1. Check that login has succeeded by observing a redirect to `http://localhost`

## Validation that non-logged in users cannot access the main application

1. Ensure that no account is logged into
1. Navigate to http://localhost
1. Check that the main application has not been accessed by observing a redirect to `http://localhost/login`

## Validation that logged in users cannot access the login page

1. Ensure that an account is logged into
1. Navigate to http://localhost/login
1. Check that the login page has not been accessed by observing a redirect to `http://localhost`

## Validation that logged in users cannot access the register page

1. Ensure that an account is logged into
1. Navigate to http://localhost/register
1. Check that the register page has not been accessed by observing a redirect to `http://localhost`

## Validation that logged in users can open the create event dialog via double-click

1. Ensure that an account is logged into
1. Navigate to http://localhost
1. Double click a day in the calendar
1. Check that the create event dialog has been opened by observing it in the centre of the screen

## Validation that logged in users can open the create event dialog via the add icon button

1. Ensure that an account is logged into
1. Navigate to http://localhost
1. Click the add icon button in the top-right hand corner
1. Check that the create event dialog has been opened by observing it in the centre of the screen

## Validation that logged in users can open the speech input dialog

1. Ensure that an account is logged into
1. Navigate to http://localhost
1. Open the create event dialog
1. Click the microphone icon button in the top-right hand corner of the dialog
1. Check that the speech input dialog has been opened by observing it in the centre of the screen

## Validation that logged in users can create events

1. Ensure that an account is logged into
1. Navigate to http://localhost
1. Open the create event dialog
1. Input an appropriate title, date, and time
1. Click the "Create" button
1. Check that the event has been created by observing the create event dialog closing, and the event appearing in the calendar on the specified date

## Validation that logged in users can view events

1. Ensure that an account is logged into
1. Navigate to http://localhost
1. Create an event
1. Click on the event in the calendar view
1. Check that the view event dialog has been opened by observing it in the centre of the screen

## Validation that logged in users can delete events

1. Ensure that an account is logged into
1. Navigate to http://localhost
1. Create an event
1. Open the view event dialog
1. Click the garbage icon button
1. Check that the event has been deleted by observing the view event dialog closing, and the event disappearing in the calendar

## Validation that logged in users can modify events

1. Ensure that an account is logged into
1. Navigate to http://localhost
1. Create an event
1. Open the view event dialog
1. Click the pencil icon button
1. Modify the title, date, and/or time
1. Click the "Update" button
1. Check that the event has been modified by observing the modify event dialog closing, and the event changing title/date/time in the calendar

## Validation that logged in users can log out

1. Ensure that an account is logged into
1. Navigate to http://localhost
1. Click the "Logout" button in the top-right hand corner
1. Check that the user has been logged out by observing a redirect to `http://localhost/login`