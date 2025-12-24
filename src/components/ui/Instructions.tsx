export const Instructions = ({ isMobile }: { isMobile: boolean }) => (
  <div className="text-center max-w-md px-4">
    <h2 className="text-lg font-semibold mb-2">Controls</h2>
    {isMobile ? (
      <ul className="text-sm space-y-1 text-gray-200">
        <li>Use the Joystick to Move & Look</li>
      </ul>
    ) : (
      <ul className="text-sm space-y-1 text-gray-200">
        <li>
          <span className="font-bold">W, A, S, D</span> to Move
        </li>
        <li>
          <span className="font-bold">Esc</span> to Pause
        </li>
      </ul>
    )}
  </div>
);
