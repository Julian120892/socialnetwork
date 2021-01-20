export default function Profilepic(props) {
    return (
        <>
            <img
                className="profile-picture"
                onClick={() => props.toggleUploader()}
                src={props.profilepic}
                alt="user profile Picture"
            />
        </>
    );
}
