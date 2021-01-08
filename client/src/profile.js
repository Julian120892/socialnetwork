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
            <h1>
                {first} {last}
            </h1>
            <BioEditor bio={bio} updateProfile={updateProfile} />
        </div>
    );
}
