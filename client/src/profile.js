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
                Profile {first} {last}
            </h1>
            <Profilepic
                profilepic={profilepic}
                toggleUploader={toggleUploader}
            />
            <BioEditor bio={bio} updateProfile={updateProfile} />
        </div>
    );
}

//destructure bio
//pass bio to <Profilepic />
