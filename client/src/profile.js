import Profilepic from "./profilePic";
import BioEditor from "./bioEditor";

export default function Profile({
    first,
    last,
    profilepic,
    toggleUploader,
    updateProfile,
    bio,
}) {
    return (
        <div className="profile-page">
            <Profilepic
                profilepic={profilepic}
                toggleUploader={toggleUploader}
            />
            <div className="profile-text">
                <h1>{first}</h1>
                <BioEditor bio={bio} updateProfile={updateProfile} />
            </div>
        </div>
    );
}
