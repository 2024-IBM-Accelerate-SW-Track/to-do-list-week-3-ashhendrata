import { render, screen, fireEvent} from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});




 test('test that App component doesn\'t render dupicate Task', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole('button', { name: /Add/i });
  const dueDate = "05/30/2023";
  
  fireEvent.change(inputTask, { target: { value: "Task 1" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(addButton);
  
  fireEvent.change(inputTask, { target: { value: "Task 1" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(addButton);
  
  const tasks = screen.getAllByText(/Task 1/i);
  expect(tasks.length).toBe(1);
 });

 test('test that App component doesn\'t add a task without task name', () => {
  render(<App />);
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole('button', { name: /Add/i });
  const dueDate = "05/30/2023";
  
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(addButton);
  
  const tasks = screen.queryAllByText(/05\/30\/2023/i);
  expect(tasks.length).toBe(0); 
 });

 test('test that App component doesn\'t add a task without due date', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const addButton = screen.getByRole('button', { name: /Add/i });
  
  fireEvent.change(inputTask, { target: { value: "Task without due date" } });
  fireEvent.click(addButton);
  
  const tasks = screen.queryAllByText(/Task without due date/i);
  expect(tasks.length).toBe(0); 
 });



 test('test that App component can be deleted thru checkbox', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole('button', { name: /Add/i });
  const dueDate = "05/30/2023";
  
  // Add a task
  fireEvent.change(inputTask, { target: { value: "Task to be deleted" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(addButton);
  
  // Delete the task
  const checkbox = screen.getByRole('checkbox');
  fireEvent.click(checkbox);
  
  const tasks = screen.queryAllByText(/Task to be deleted/i);
  expect(tasks.length).toBe(0); 
 });


 test('test that App component renders different colors for past due events', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const addButton = screen.getByRole('button', { name: /Add/i });
  const dueDate = "05/30/2023"; // Assuming this date is in the past
  
  // Add a task with a past due date
  fireEvent.change(inputTask, { target: { value: "Past Due Task" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(addButton);
  
  const pastDueTask = screen.getByTestId(/Past Due Task/i);
  const backgroundColor = pastDueTask.style.backgroundColor;
  
  expect(backgroundColor).toBe("rgb(255, 204, 204)");
 });
