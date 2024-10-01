import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Home from "@/components/molecules/home";

// Fetch session on the server side
export default function HomePage() {
  return (
    <div>
      <Home />
    </div>
  );
  // // Safely access username or fallback
  // const { data: session } = useSession();

  // return (
  //   <div>
  //     <div>
  //       {session?.user?.avatarURL ? (
  //         <Image
  //           src={session?.user?.avatarURL}
  //           width={200}
  //           height={130}
  //           alt="Picture of the author"
  //         />
  //       ) : (
  //         <p>No avatar found</p>
  //       )}
  //     </div>
  //     <Link href="/login">
  //       <button>Go to login please</button>
  //     </Link>
  //     {/* <LogoutButton />
  //     <UploadComponent /> */}
  //     <UserAvatar />
  //   </div>
  // );
}

// // Client component for logout
// function LogoutButton() {
//   const router = useRouter();

//   const logout = async () => {
//     await signOut({ redirect: false });
//     router.push("/login"); // Manually redirect to login page
//   };

//   return <button onClick={logout}>Logout</button>;
// }
