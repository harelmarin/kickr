import type {FC} from 'react';

export const LoginDropdown: FC = () => (
    <div className="absolute top-full mt-1 right-0 w-40 bg-primary border border-gray-700 rounded-md shadow-lg p-2 z-50 flex flex-col gap-2">
        <input
            type="email"
            placeholder="Email"
            className="p-1 rounded bg-gray-800 text-white text-sm w-full hover:border-secondary"
        />
        <input
            type="password"
            placeholder="Password"
            className="p-1 rounded bg-gray-800 text-white text-sm w-full"
        />
        <button className="bg-secondary p-1 rounded text-sm hover:opacity-90 transition w-full">
            Login
        </button>
    </div>
);

export const RegisterDropdown: FC = () => (
    <div className="absolute top-full mt-1 right-0 w-40 bg-primary border border-gray-700 rounded-md shadow-lg p-2 z-50 flex flex-col gap-2">
        <input
            type="text"
            placeholder="Username"
            className="p-1 rounded bg-gray-800 text-white text-sm w-full"
        />
        <input
            type="email"
            placeholder="Email"
            className="p-1 rounded bg-gray-800 text-white text-sm w-full"
        />
        <input
            type="password"
            placeholder="Password"
            className="p-1 rounded bg-gray-800 text-white text-sm w-full"
        />
        <button className="bg-secondary p-1 rounded text-sm hover:opacity-90 transition w-full">
            Register
        </button>
    </div>
);
