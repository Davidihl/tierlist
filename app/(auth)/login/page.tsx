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
      <div className="flex gap-4 items-center">
        <button className="btn btn-primary rounded-full">
          <span className="loading loading-spinner loading-sm" />
          Login
        </button>
        <button className="btn btn-secondary rounded-full group">
          <span className="w-0 group-hover:loading loading-spinner loading-sm transition-all" />
          Sign up
        </button>
      </div>
    </form>
  );
}
