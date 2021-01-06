export default function Profilepic(props) {
    return (
        <div>
            <img
                onClick={() => props.toggleUploader()}
                src={props.profilepic}
                alt="user profile Picture"
            />
        </div>
    );
}
