export default function LoginPage() {
  return (
    <form>
      <label>
        Username
        <input
          // eslint-disable-next-line upleveled/no-unnecessary-html-attributes
          type="text"
          placeholder="Username"
          className="p-2 block"
        />
      </label>
      <label>
        Password
        <input type="password" placeholder="Password" className="p-2 block" />
      </label>
      <button className="bg-red-200">Login</button>
    </form>
  );
}
