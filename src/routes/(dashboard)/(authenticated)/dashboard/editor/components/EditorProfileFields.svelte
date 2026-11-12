<script lang="ts">
  import Textfield from "#lib/components/Textfield.svelte";

  import type { EditorFieldErrors } from "../editor-form";

  let {
    idPrefix,
    name = $bindable(),
    username = $bindable(),
    email = $bindable(),
    nameErrors = [],
    usernameErrors = [],
    emailErrors = [],
    onClearError
  }: {
    idPrefix: string;
    name: string;
    username: string;
    email: string;
    nameErrors?: string[];
    usernameErrors?: string[];
    emailErrors?: string[];
    onClearError: (field: keyof EditorFieldErrors) => void;
  } = $props();
</script>

<Textfield
  id="{idPrefix}-editor-name"
  name="name"
  label="Nama Lengkap"
  required
  bind:value={name}
  placeholder="Contoh: Budi Santoso"
  isError={nameErrors.length > 0}
  supporting={nameErrors}
  oninput={() => onClearError("name")}
/>

<Textfield
  id="{idPrefix}-editor-username"
  name="username"
  label="Username"
  required
  bind:value={username}
  placeholder="Contoh: budi"
  isError={usernameErrors.length > 0}
  supporting={usernameErrors}
  oninput={() => onClearError("username")}
/>

<Textfield
  id="{idPrefix}-editor-email"
  name="email"
  type="email"
  label="Email"
  required
  bind:value={email}
  placeholder="Contoh: budi@email.com"
  isError={emailErrors.length > 0}
  supporting={emailErrors}
  oninput={() => onClearError("email")}
/>
