import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { Component, createSignal, For, Show } from "solid-js";
import { disableErrorToast, setError, setScreenState } from "../App";
import { app } from "../firebase-config";
import { data as societyData } from "../socities";
import { setUser, user } from "./RegistrationForm";

let colors = ["bg-primary", "bg-secondary", "bg-error"];

const SocietySelection: Component = () => {
  const [loading, setLoading] = createSignal(false);
  const [selectedSocities, setSelectedSocities] = createSignal<string[]>([]);

  const auth = getAuth();
  const db = getFirestore(app);
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      setUser(null);
      setScreenState("registration");
    }
  });

  const handleSocietyFinal = () => {
    if (selectedSocities().length === 0) {
      setError("Please select atleast one society");
      disableErrorToast();
      return;
    }

    if (user() === null) {
      setError("Please login again");
      disableErrorToast();
      return;
    }

    const docRef = doc(db, "registrations", user()!.uid!);

    setLoading(true);
    // first get the document
    getDoc(docRef)
      .then((doc) => {
        if (doc.exists()) {
          if (doc.data()?.socities) {
            setError("You have already selected socities");
            disableErrorToast();

            setScreenState("whatsapp-group");
          } else {
            // update document
            updateDoc(docRef, {
              socities: selectedSocities(),
            })
              .then(() => {
                console.log("Document successfully updated!");
                setScreenState("whatsapp-group");
              })
              .catch((error) => {
                setError(error.message);
                disableErrorToast();
              })
              .finally(() => {
                setLoading(false);
              });
          }
        }
      })
      .catch((error) => {
        setError(error.message);
        disableErrorToast();
      });
  };

  return (
    <main class="fixed bottom-0 top-5 left-1/2 -translate-x-1/2 w-[95vw] max-w-7xl  bg-base-300/70 rounded-t-md shadow-2xl">
      <div class="p-3 border-b flex justify-between sticky top-0">
        <h1 class="text-4xl font-bold ">Society Selection</h1>
        <div>
          <button
            onClick={(_e) => {
              if (loading()) return;
              handleSocietyFinal();
            }}
            disabled={loading()}
            class="text-lg  btn btn-primary btn-lg disabled:outline disabled:outline-primary"
          >
            <Show when={loading()} fallback={<span>Final Submit</span>}>
              <progress
                class="progress progress-primary w-20"
                max="100"
              ></progress>
            </Show>
          </button>
        </div>
      </div>

      <section class="h-[80vh] md:h-[88vh] overflow-y-scroll py-2">
        <For each={Object.entries(societyData)}>
          {([key, value], i) => (
            <>
              <article class="p-2">
                <h2 class="text-2xl font-bold ">{key}</h2>
              </article>
              <div class="grid grid-cols-2 place-content-center px-4 gap-4 md:grid-cols-3 lg:grid-cols-5">
                <For each={Object.entries(value)}>
                  {([key, value]) => (
                    <div
                      class={`card card-compact cursor-pointer w-full p-1 shadow-xl h-20 flex justify-center items-center rounded-md ${
                        colors[i()]
                      }
                      ${
                        selectedSocities().includes(key)
                          ? "ring-4 ring-accent"
                          : "ring-2 ring-transparent"
                      }
                      `}
                      onClick={() => {
                        if (selectedSocities().includes(key)) {
                          setSelectedSocities(
                            selectedSocities().filter((s) => s !== key)
                          );
                        } else {
                          setSelectedSocities([...selectedSocities(), key]);
                        }
                      }}
                    >
                      <div class="card-body">
                        <h2 class="text-lg text-center font-bold text-primary-content">
                          {key}
                        </h2>
                      </div>
                    </div>
                  )}
                </For>
              </div>
            </>
          )}
        </For>
      </section>
    </main>
  );
};

export { SocietySelection };
