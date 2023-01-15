import { Component, createEffect, createSignal, Show } from "solid-js";

import {
  collection,
  getFirestore,
  where,
  query,
  getDocs,
  addDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { app } from "../firebase-config";
import { disableErrorToast, setError, setScreenState } from "../App";
import { google, tooltip, checkMark } from "../Assets/svg";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  User,
} from "firebase/auth";

const branchRoll = {
  CSDA: "UCB",
  CIOT: "UCI",
  "ECAM-1": "UEA",
  "ECAM-2": "UEA",
} as const;

type branch = keyof typeof branchRoll;

export const [docId, setDocId] = createSignal("");
export const [user, setUser] = createSignal<User | null>(null);

onAuthStateChanged(getAuth(app), (user) => {
  if (user) {
    setUser(user);
  } else {
    setDocId("");
    setUser(null);
  }
});

const RegistrationForm: Component = () => {
  const [loading, setLoading] = createSignal(false);

  const [name, setName] = createSignal("");
  const [universityRollNumber, setUniversityRollNumber] = createSignal("");
  const [branch, setBranch] = createSignal<branch | "">("");
  const [mobile, setMobile] = createSignal("");

  const [nameError, setNameError] = createSignal("");
  const [emailError, setEmailError] = createSignal("");
  const [branchError, setBranchError] = createSignal("");
  const [mobileError, setMobileError] = createSignal("");
  const [universityRollNumberError, setUniversityRollNumberError] =
    createSignal("");

  const db = getFirestore(app);

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    let error = false;

    if (name().trim() === "") {
      setNameError("Please enter a name");
      error = true;
    } else {
      setNameError("");
    }

    if (branch() === "") {
      setBranchError("Please select a branch");
      error = true;
    } else {
      setBranchError("");
    }

    if (
      !universityRollNumber()
        .toLocaleUpperCase()
        .includes(branchRoll[branch() as branch]) ||
      universityRollNumber().length !== 11 ||
      !/^\d+$/.test(universityRollNumber().slice(7)) ||
      !["2020", "2021", "2022"].includes(universityRollNumber().slice(0, 4))
    ) {
      setUniversityRollNumberError(
        "Please enter a valid University Roll Number"
      );
      error = true;
    } else {
      setUniversityRollNumberError("");
    }

    if (!user()?.email?.includes("@nsut.ac.in")) {
      setEmailError("Please enter a valid NSUT email");
      error = true;
    } else {
      setEmailError("");
    }

    if (mobile().trim().length !== 10) {
      setMobileError("Please enter a valid mobile number");
      error = true;
    } else {
      setMobileError("");
    }

    if (error) {
      return;
    }

    if (user() == null) {
      return;
    }

    const formData = {
      name: name().trim(),
      universityRollNumber: universityRollNumber().trim().toLocaleUpperCase(),
      branch: branch(),
      mobile: mobile().trim(),
      email: user()?.email?.trim(),
    };

    // make a query to check if roll number already exists\
    // const registrationRef = collection(db, "registrations");
    const docRef = doc(db, "registrations", user()?.uid!);

    setLoading(true);

    getDoc(docRef)
      .then((querySnapshot) => {
        console.log(querySnapshot.data());
        if (querySnapshot.exists()) {
          // check if scioties field exists
          if (querySnapshot.data()?.socities) {
            setError("Roll Number already exists");
            disableErrorToast();

            setScreenState("whatsapp-group");
          } else {
            // redirect to socities page
            setScreenState("society-selection");
          }
        } else {
          setDoc(docRef, formData);
          alert("Registration Successful");

          // redirect to socities page
          setScreenState("society-selection");
        }
      })
      .then(() => {
        setName("");
        setUniversityRollNumber("");
        setBranch("");
        setMobile("");
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
        disableErrorToast();
      });
  };

  const signInWithGoogle = (
    e: MouseEvent & {
      currentTarget: HTMLButtonElement;
      target: Element;
    }
  ) => {
    e.preventDefault();

    const provider = new GoogleAuthProvider();

    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result.user);
        // check if the email conatains @nsut.ac.in
        if (result.user.email?.includes("@nsut.ac.in")) {
          // set the email and name
          setUser(result.user);
        } else {
          setError("Please use a valid NSUT email");
          disableErrorToast();

          // log out the user
          auth.signOut();
        }
      })
      .catch((error) => {
        setError("Failed to sign in with Google");
        disableErrorToast();
        console.log(error);
      });
  };

  return (
    <main class="w-[95vw] top-5 lg:w-[80vw] max-w-[800px]  shadow-lg bg-neutral/75  fixed bottom-0 left-1/2 -translate-x-[50%] rounded-t-md overflow-y-scroll">
      <h1 class="text-4xl p-4 font-bold text-primary-content sticky border-b top-0 bg-base-300">
        Registration Form
      </h1>

      <form
        class={`flex flex-col justify-start items-stretch gap-3 pt-4 px-4 overflow-y-scroll`}
        onSubmit={handleSubmit}
      >
        <div class="field form-control">
          <label
            for="name"
            class="text-lg text-secondary-content font-semibold mb-1"
          >
            Name
          </label>
          <div>
            <input
              class={`input input-bordered  w-full  ${
                nameError() ? "input-error" : ""
              }`}
              type="text"
              id="name"
              name="name"
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
            />
          </div>

          {nameError() && <p class="text-sm text-red-500">{nameError()}</p>}
        </div>

        <div class="form-control">
          <label
            for="university-roll-number"
            class="text-lg font-semibold mb-1 text-secondary-content"
          >
            University Roll Number
          </label>
          <div class="control">
            <input
              class={`input input-bordered  w-full  ${
                universityRollNumberError() ? "input-error" : ""
              }`}
              type="text"
              id="university-roll-number"
              name="universityRollNumber"
              value={universityRollNumber()}
              onInput={(e) => setUniversityRollNumber(e.currentTarget.value)}
            />
          </div>

          {universityRollNumberError() && (
            <p class="text-sm text-red-500">{universityRollNumberError()}</p>
          )}
        </div>

        <div class="field">
          <label
            for="mobile"
            class="text-lg font-semibold mb-1 text-secondary-content"
          >
            Mobile Number
          </label>
          <div class="control">
            <input
              class={`input input-bordered  w-full  ${
                mobileError() ? "input-error" : ""
              }`}
              type="text"
              id="mobile"
              name="mobile"
              value={mobile()}
              onInput={(e) => setMobile(e.currentTarget.value)}
            />
          </div>

          {mobileError() && <p class="text-sm text-red-500">{mobileError()}</p>}
        </div>

        <div class="form-control">
          <label
            class="text-lg font-semibold mb-1 text-secondary-content"
            for="branch"
          >
            Branch
          </label>
          <div class="flex justify-between pr-16">
            <label class="flex items-center gap-2 font-bold text-secondary-content">
              <input
                type="radio"
                class="radio radio-accent radio-sm"
                name="branch"
                id="input_csda"
                value={"CSDA"}
                onInput={(e) => setBranch(e.currentTarget.value as branch)}
                checked={branch() === "CSDA"}
              />{" "}
              CSDA
            </label>
            <label class="flex items-center gap-2 font-bold text-secondary-content">
              <input
                type="radio"
                name="branch"
                class="radio radio-accent radio-sm"
                id="input_ciot"
                value={"CIOT"}
                onInput={(e) => setBranch(e.currentTarget.value as branch)}
                checked={branch() === "CIOT"}
              />{" "}
              CIOT
            </label>
            <label class="flex items-center gap-2 font-bold text-secondary-content">
              <input
                type="radio"
                name="branch"
                class="radio radio-accent radio-sm"
                id="input_ecam_1"
                value={"ECAM-1"}
                onInput={(e) => setBranch(e.currentTarget.value as branch)}
                checked={branch() === "ECAM-1"}
              />{" "}
              ECAM 1
            </label>
            <label class="flex items-center gap-2 font-bold text-secondary-content">
              <input
                type="radio"
                name="branch"
                class="radio radio-accent radio-sm"
                id="input_ecam_2"
                value={"ECAM-2"}
                onInput={(e) => setBranch(e.currentTarget.value as branch)}
                checked={branch() === "ECAM-2"}
              />{" "}
              ECAM 2
            </label>
          </div>

          {branchError() && <p class="text-sm text-red-500">{branchError()}</p>}
        </div>

        <div class="field">
          <label
            for="email"
            class="text-lg font-semibold text-secondary-content mb-1 flex items-center gap-2"
          >
            Email{" "}
            <span
              class="tooltip tooltip-right"
              data-tip="Only college email ID's are accepted"
            >
              {tooltip}
            </span>
          </label>
          {/*
          <div class="control">
            <input
              class={`input input-bordered  w-full  ${
                emailError() ? "input-error" : ""
              }`}
              type="email"
              id="email"
              name="email"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
            />
          </div> */}
          <button
            class="w-full btn flex items-center gap-2"
            type="button"
            onClick={(e) => {
              if (user() == null) {
                signInWithGoogle(e);
              }
            }}
          >
            <Show
              when={user() != null}
              fallback={
                <>
                  Sign in with Google{" "}
                  <span class="text-2xl text-primary-content">{google}</span>
                </>
              }
            >
              <span class="text-2xl text-primary-content">{checkMark}</span>
            </Show>
          </button>

          {emailError() && <p class="text-sm text-red-500">{emailError()}</p>}
        </div>
        <div class="control mt-8 flex justify-center">
          <button
            class="btn btn-accent w-5/6 disabled:outline disabled:outline-accent"
            disabled={loading()}
          >
            <Show when={loading()} fallback={"Next"}>
              <progress
                class="progress progress-accent w-48"
                max="100"
              ></progress>
            </Show>
          </button>
        </div>
      </form>
    </main>
  );
};

export { RegistrationForm };
