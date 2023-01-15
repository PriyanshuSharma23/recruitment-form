import { Component, createSignal, Match, Show, Switch } from "solid-js";
import { ParallaxScene } from "./Components/ParallaxScene";
import { RegistrationForm } from "./Components/RegistrationForm";
import { SocietySelection } from "./Components/SocitiesSelection";
import { WhatsappLinks } from "./Components/WhatsappLinks";

export const [error, setError] = createSignal("");

export const disableErrorToast = () => {
  setTimeout(() => {
    setError("");
  }, 5000);
};

type ScreenStates = "registration" | "society-selection" | "whatsapp-group";
export const [screenState, setScreenState] =
  createSignal<ScreenStates>("whatsapp-group");

const App: Component = () => {
  return (
    <>
      <Show when={error() !== ""}>
        <div class="toast toast-top toast-center min-w-max z-50">
          <div class="alert alert-error">
            <div>
              <span>{error}</span>
            </div>
          </div>
        </div>
      </Show>
      <ParallaxScene />
      <Switch fallback={<div>404</div>}>
        <Match when={screenState() === "registration"}>
          <RegistrationForm />
        </Match>
        <Match when={screenState() === "society-selection"}>
          <SocietySelection />
        </Match>
        <Match when={screenState() === "whatsapp-group"}>
          <WhatsappLinks />
        </Match>
      </Switch>
    </>
  );
};

export default App;
