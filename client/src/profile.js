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
            <h1>
                {first} {last}
            </h1>
            <Profilepic
                profilepic={profilepic}
                toggleUploader={toggleUploader}
            />
            <BioEditor bio={bio} updateProfile={updateProfile} />
        </div>
    );
}
