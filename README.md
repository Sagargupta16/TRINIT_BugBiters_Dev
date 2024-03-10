# Lingua Connect

**Objective:**  
Lingua Connect aims to design and develop an interactive online platform that connects language learners with teachers for personalized online lessons. The platform facilitates users to choose tutors based on their target language, fluency, budget, and schedule.

Here us Our Video Explaination Video : https://drive.google.com/drive/folders/1FuOogrCMMBdZ2EjXkQJGT1aNbxW4NviK?usp=drive_link

## Features:

### For Students:

1. **User Registration:**
   - Students can register themselves on the platform.

2. **Tutor Search:**
   - Students can filter tutors based on language, experience, and pricing.

3. **Scheduling:**
   - Students can select available time slots for a given tutor.
   - Option to choose from various lesson lengths: 45, 60, or 90-minute sessions.

4. **Flashcards:**
   - Students can store flashcards for a specific language.
   - Options to add, remove, and review flashcards.

### For Tutors:

1. **User Registration:**
   - Tutors can register themselves on the platform.

2. **Class Setup:**
   - Tutors can set up classes based on their availability.
   - Classes are organized according to time slots.

3. **Pricing:**
   - Tutors can set their own pricing.
   - Option to charge different prices based on the level of teaching.

### General:

1. **One-to-One Video Call:**
   - Implemented a video call feature for conducting classes.
   - Tutors and students can share their screens to discuss and share ideas.

2. **Subscription-Based Payment Model:**
   - Implemented a subscription-based payment model for students.
   - Final part of selecting a tutor involves subscription.

## Additional Features Implemented:

1. **Broadcast Live Sessions:**
   - Tutors can broadcast live sessions to multiple students.
   - Scheduling of live sessions decided by the tutor.
   - Students receive appropriate notifications regarding live sessions.

2. **Personalized Tests:**
   - Tutors can assess students by arranging personalized tests.
   - Upon completion, tutors can send feedback for each question to the student.
   - Students can review past tests in a dedicated section.

## File Structure

The file structure of the project is as follows:

```bash
Placemento
├── client
│   ├── public
│   └── src
│       ├── api
│       ├── components
│       ├── pages
│       ├── utils
│       ├── App.jsx
│       ├── index.js
│       └── ...
├── server
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   ├── index.js
│   └── ...
├── .gitignore
├── package.json
└── ...
```

## Installation

To get started, follow these instructions to install the project on your local machine.

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js (v20.0.0 or higher)
- npm (v10.0.0 or higher)

### Steps

1. Creating your branch:

   I. For Contributors:

   - **Forking the Repository:** If you are an external contributor, you should fork the repository to your GitHub account. This will create a copy of
     the repository under your account, which you can use to make changes and submit pull requests.

   - **Branch Creation:** After forking the repository, create a new branch from the `develop` branch. The branch name should be in the format
     `feature-` where `<description>` represents a short description of the task or feature you are working on. For example, if you are adding a login
     feature, the branch name could be `feature-login`.

   - **Code Implementation:** Implement the necessary changes and new features on your created branch. Make sure to adhere to the organization's
     coding standards and best practices.

   - **Code Testing:** Thoroughly test your changes on the branch to ensure that they work as expected and do not introduce any bugs or issues.

   - **Code Review:** If required by the organization's development process, request a code review from your peers to ensure code quality and
     adherence to project guidelines.

   - **Pull Request Creation:** Once you are confident that your code is complete and tested, create a pull request to merge your changes from the
     `feature-*` branch into the `develop` branch. Clearly explain the purpose and scope of the changes in the pull request description.

2. Clone the repository:

   ```bash
   git clone https://github.com/Sagargupta16/TRINIT_BugBiters_Dev.git
   ```

3. Navigate to the project directory:

   ```bash
   cd TRINIT_BugBiters_Dev
   ```

4. Install the project dependencies:

   ```bash
   npm install
   npm run fb-install
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the application in your browser:

   ```bash
   http://localhost:3000
   ```

   The application should now be running in your browser.

## Contributing

If you would like to contribute to the project, please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information.

## License

This project is licensed under the [MIT License](LICENSE).

## Project Team

The project team consists of the following members:

- [Sagar Gupta](https://github.com/Sagargupta16 "Sagar Gupta")
- [Sachin Gupta](https://github.com/sachin-gupta99 'Sachin Gupta')
- [Rahul Raj](https://github.com/DexTerMtor-Rahul 'Rahul Raj')

## References

- [MERN Stack](https://www.mongodb.com/mern-stack "MERN Stack")
- [React](https://reactjs.org/ "React")
- [Node.js](https://nodejs.org/ "Node.js")
- [Express](https://expressjs.com/ "Express")
- [MongoDB](https://www.mongodb.com/ "MongoDB")
- [React-Router](https://reactrouter.com/ "React-Router")
- [Axios](https://axios-http.com/ "Axios")
- [JWT](https://jwt.io/ "JWT")
- [Bcrypt](https://www.npmjs.com/package/bcrypt "Bcrypt")
- [Mongoose](https://mongoosejs.com/ "Mongoose")
- [Nodemailer](https://nodemailer.com/ "Nodemailer")
- [Dotenv](https://www.npmjs.com/package/dotenv "Dotenv")
- [Cors](https://www.npmjs.com/package/cors "Cors")
- [Nodemon](https://www.npmjs.com/package/nodemon "Nodemon")
- [Concurrently](https://www.npmjs.com/package/concurrently "Concurrently")
- [Prettier](https://prettier.io/ "Prettier")

Deployed Here : https://trinit-bugbiters-dev.onrender.com
