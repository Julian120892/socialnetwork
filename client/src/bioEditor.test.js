import BioEditor from "./profilepic";
import { render, fireEvent, waitForElement } from "@testing-library/react";
import axios from "./axios";
import App from "./app";

jest.mock("./axios");

// axios.get.mockResolvedValue({
//     data: {
//         bio: "some Bio, in here to mock a real Bio",
//     },
// });

test("When no bio is passed to bioEditor, an 'Add' button is rendered.", () => {
    const { container } = render(<BioEditor bio="" updateProfile="true" />);
    expect(container.querySelector("button").innerHTML).toBe("add");
});

test("When a bio is passed to it, an 'Edit' button is rendered.", () => {
    const { container } = render(
        <BioEditor bio="Some bio" updateProfile="true" />
    );
    expect(container.querySelector("button").innerHTML).toBe("edit");
});

// test("Clicking either the add or edit button causes a textarea and a 'Save' button to be rendered.", () => {
//     const mockOnClick = jest.fn();
//     const { container } = render(
//         <BioEditor onClick={mockOnClick} updateProfile="true" />
//     );

//     fireEvent.click(container.querySelector("button"));
// });

// test("Clicking the 'Save' button causes an ajax request. The request should not actually happen during your test. To prevent it from actually happening, you should mock axios.", () => {
//     const mockOnClick = jest.fn();
//     const { container } = render(<BioEditor onClick={mockOnClick} />);

//     fireEvent.click(container.querySelector("button"));
// });

// test("When the mock request is successful, the function that was passed as a prop to the component gets called.", () => {
//     const { container } = render(<BioEditor />);
// });
