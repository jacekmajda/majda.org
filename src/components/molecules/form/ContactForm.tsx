import './ContactFormStyles.module.css';
import { createSignal, Show } from 'solid-js'
import { createStore } from "solid-js/store";

interface FormFields {
  email: string;
}

export default function ContactForm() {

  const [form, setForm] = createStore<FormFields>({
    email: "",
  });
  const [sent, setSent] = createSignal(false);

  async function postFormData(formData: FormFields) {
    try {
      const response = await fetch("https://api.majda.org/contact", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log('response data: ', data);
      setSent(true)
      return data;

    } catch (error) {
      console.log('error: ', error);
    }
  }

  const updateFormField = (fieldName: string) => (event: Event) => {
    const inputElement = event.currentTarget as HTMLInputElement;
    setForm({
      [fieldName]: inputElement.value
    });
  };


  const submit = (e: SubmitEvent) =>{
    e.preventDefault();
    setSent(true)

    postFormData({email: form.email});
  }

  return (
    <form
      onSubmit={submit}
      class="form flex flex-col"
      >
        <Switch fallback={<div>Loading form...</div>}>
          <Match when={!sent()}>
          <input
                  onChange={updateFormField("email")}
                  value={form.email}
                  type="email"
                  name="email"
                  required
                  placeholder="Email"
                />
                <button type="submit" name="submit" class="button button--negative">Send</button>
          </Match>
          <Match when={sent()}>
          <div class="flex items-center">
              <lottie-player
                autoplay
                mode="normal"
                src="/assets/animations/check-mark.json"
                style="width: 200px"
              >
              </lottie-player>
              <div class="success flex flex-col" style="color: #9FCC8E">Thank You for the contact! I will reach out to You as soon as possible! </div>
          </div>
          </Match>
        </Switch>

    </form>
  );
}
