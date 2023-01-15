import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { createSignal, For, onMount } from "solid-js";
import { setScreenState } from "../App";
import { app } from "../firebase-config";
import { data } from "../socities";
import { setUser, user } from "./RegistrationForm";

const WhatsappLinks = () => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      setScreenState("registration");
      setUser(null);
    }
  });

  const db = getFirestore(app);
  const [socities, setSocities] = createSignal<string[]>([]);

  onMount(() => {
    if (user() === null) {
      setScreenState("registration");
      return;
    }

    // fetch user data
    const uid = user()?.uid;

    const docRef = doc(db, "registrations", uid!);

    // first get the document
    getDoc(docRef).then((doc) => {
      if (doc.exists()) {
        if (doc.data()?.socities) {
          // set socities
          setSocities(doc.data()?.socities);
        } else {
          setScreenState("society-selection");
        }
      } else {
        setScreenState("registration");
      }
    });
  });

  return (
    <main class="fixed top-5 bottom-0 left-1/2 -translate-x-1/2  w-[95vw] md:w-[80vw] bg-base-300/80 flex gap-2 flex-col p-2 overflow-y-scroll">
      {/* get links from data */}

      <For each={socities()}>
        {(society) => {
          return (
            <a
              // @ts-ignore
              href={
                // @ts-ignore
                data["CULTURAL SOCIETY CHAPTER"][society]?.whatsapp ||
                // @ts-ignore
                data["LITERARY SOCIETY CHAPTER"][society]?.whatsapp ||
                // @ts-ignore
                data["TECHNICAL SOCIETY CHAPTER"][society]?.whatsapp ||
                ""
              }
              target="_blank"
              class="w-full rounded-md shadow-md btn text-primary-content flex gap-2"
            >
              join <span class="font-extrabold text-accent"> {society}</span>{" "}
              whatsapp group
            </a>
          );
        }}
      </For>
    </main>
  );
};

export { WhatsappLinks };
