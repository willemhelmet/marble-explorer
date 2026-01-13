import { useMemo } from "react";

interface ApiInputProps {
  value: string;
  onChange: (value: string) => void;
  isValid: boolean;
}

export const ApiInput = ({ value, onChange, isValid }: ApiInputProps) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label
        htmlFor="apiKey"
        className="text-sm font-mono uppercase text-neutral-400 font-bold"
      ></label>
      <div className="relative">
        <input
          id="apiKey"
          type="password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. DxHrSJ8xtUINzENSe3Ab1F1cjIyWjtSJ"
          className={`w-full bg-black border px-4 py-3 rounded font-mono text-white focus:outline-none focus:ring-1 transition-colors ${
            value && !isValid
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-neutral-700 focus:border-blue-500 focus:ring-blue-500"
          }`}
        />
        {value && !isValid && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-xs font-bold">
            INVALID FORMAT
          </span>
        )}
      </div>
      {/* <p className="text-xs text-neutral-500"> */}
      {/*   Don't have a key? Get one at{" "} */}
      {/*   <a */}
      {/*     href="https://marble.worldlabs.ai/settings" */}
      {/*     target="_blank" */}
      {/*     rel="noopener noreferrer" */}
      {/*     className="text-blue-400 hover:underline" */}
      {/*   > */}
      {/*     marble.worldlabs.ai/settings */}
      {/*   </a> */}
      {/* </p> */}
    </div>
  );
};
