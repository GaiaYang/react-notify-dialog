"use client";

import { useState } from "react";

import useDialogMachine, {
  type DialogPhase,
} from "@/notify/hooks/useDialogMachine";

const MODAL_ID = "modal_1";

export default function Demo() {
  const [phase, setPhase] = useState<DialogPhase>("unmounted");
  const { ref, toggle } = useDialogMachine({
    onPhaseChange: setPhase,
  });
  const [mount, setMount] = useState(true);

  return (
    <section>
      <button type="button" onClick={() => toggle()} className="btn">
        開關dialog
      </button>
      <button type="button" onClick={() => setMount((e) => !e)} className="btn">
        {mount ? "卸載dialog" : "加載dialog"}
      </button>
      <p>{phase}</p>
      <p>{`已${mount ? "加載" : "卸載"}dialog`}</p>
      {mount && (
        <dialog ref={ref} id={MODAL_ID} className="modal">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Hello!</h3>
            <p className="py-4">
              Press ESC key or click the button below to close
            </p>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      )}
    </section>
  );
}
