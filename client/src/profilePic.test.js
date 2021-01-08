import ProfilePic from "./profilepic";
import { render } from "@testing-library/react";

test("When no 'profilepic' is passed to state, no new img is used as src (falls back to Parent src in App)", () => {
    const { container } = render(<ProfilePic />);
    expect(container.querySelector("img").src).toBe("");
});

test("When 'profilepic' is passed to state, that url will set as the src value of the img", () => {
    const { container } = render(
        <ProfilePic profilepic="https://www.test.com/test-image" />
    );
    expect(container.querySelector("img").src).toBe(
        "https://www.test.com/test-image"
    );
});
