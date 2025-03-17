## Keyhook Interview Task

This is the Keyhook interview task for frontend developers.

### Overview

Our actual stack comprises of a rails backend using Graphiti to power our API. And a separate ReactJS app that powers our web and mobile apps ( we use CapacitorJS for our mobile app ).
However in this test we have written a quick node.js backend to power the API you will be working with.
This API does not use best practices and is not optimised for production and is only meant as a means of having data available to test against.

We have prepared this small test as a way of checking how you can tackle some of the more day to day tasks we face when building out platform. This is a heavily slimmed down and simplified version of a part of our app.

### Task

We have provided you with a simple node backend API. It holds 2 data models, Employees and Departments.
The backend will seed itself with data whenever you run it.

The backend has comments in the code to explain what endpoints are available and what parameters are required.
This will serve as the documentation for you to use when you are working with the API.

To run the backend:

```bash
cd backend
npm install
npm run start
```

The frontend folder has a Typescript+React app ready to go, it is using vite for bundling / running the app.
To run just:

```
cd frontend
npm install
npm run dev
```

The React app should be a single page ( no routing needed ), that satisfies the following criteria.

- Uses the Tanstack table library to show a list of employees from the API.
  - The table should show these columns:
    - Name
    - Age
    - Position
    - Employeed On
    - Department Name
- Table data should be paginated and allow changing the page size.
- Sorting should be enabled on the name, age, position, employedOn columns. However only one column can be sorted at a time.
- Add a search bar that allows typing in a name and filters the records by that name. Searching should happen as a user types.
- Add a dropdown that allows you to select a department name and filters the employees by that department.
- Add a filter to allow filtering by employees that were employed before or after a certain date.

- Add a modal that allows you to add a new employee.

  - This should validate any data that is entered.

- Add a modal that shows the details of an existing employee and allows you to edit their details.

All sorting,paginating and filtering should happen through the server side query and should not be done on the frontend.

### Other Notes

Our app is entirely built on React hooks, so please be sure to use hooks and functional components instead of class components.

We recommend using a library like React Query to help with the data fetching and state management.

We would prefer all styling is done with TailwindCSS. It has already been added to the project.

You are free to use any other packages you would like to use to build the frontend.
You are free to use any documentation or google anything you might not know.

This is not timed in anyway, but for a good aproximation of how long it will take to complete this task, often some afternoons in a weekend should be enough.

Please submit your code back as a zip file, remember to remove any node_modules folders and any other unnecessary files.

### Things we will evaluate

- Has the criteria been met.
- What packages were used and how were they used. ( Please do not hestitate to use 3rd party packages )
- Code style, reuse and commenting.
- Use of Typescript types.
- Can you discuss, rationalise and explain choices you have made.
- The design of the UI.
- UX choices that you have made.
- Performance of the frontend code.

### Links

- [Tanstack Table](https://tanstack.com/table/v7)
- [Tailwind.css](https://tailwindcss.com/)
- [React Query](https://tanstack.com/query/v3)

### Contact

If you have any questions or if anything needs clarifying, please contact me at aaron.rama@keyhook.com
