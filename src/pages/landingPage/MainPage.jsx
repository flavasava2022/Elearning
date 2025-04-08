import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoginForm from "./LoginForm";

const MainPage = () => {
  const [login, setLogin] = useState(true);

  return (
    <AnimatePresence>
      <motion.main
        className={` flex items-center w-screen  ${
          login ? "justify-start" : "justify-end"
        } bg-white h-[100vh] relative overflow-hidden`}
      >
        <div className="w-[50%] flex items-center justify-center ">
          <AnimatePresence>
            {login ? <LoginForm /> : <SignupForm />}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ width: ["0%", "50%"] }}
          animate={[
            { width: login ? ["50%", "150%", "50%"] : ["50%", "160%", "50%"] }, // Step 1
            login
              ? {
                  right: "0px",
                  borderRadius: ["0 0 0 0", "0 0 0 0", "25% 0 0 25%"],
                }
              : {
                  left: "0px",
                  borderRadius: ["0 0 0 0", "0 0 0 0", "0 25% 25% 0"],
                }, // Step 2 (starts after step 1 finishes)
          ]}
          transition={{
            duration: 1,
            times: [0, 0.5, 1], // Optional: Adjust timing
          }}
          className="overflow-hidden h-full  bg-primary flex items-center justify-center absolute top-0 right-0"
        >
          <div className="flex flex-col gap-4 items-center justify-center">
            <p className="text-white text-[32px] font-bold">
              {login ? "Welcome back!" : "Hello, Friend!"}
            </p>
            <p className="text-[26px] text-white text-center">
              {login ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              className="cursor-pointer border-2 flex items-center justify-center py-2 border-white rounded-md px-4 w-full bg-white text-[#4B49AC]"
              onClick={() => setLogin(!login)}
            >
              {login ? "Sign up" : "Sign in"}
            </button>
          </div>
        </motion.div>
      </motion.main>
    </AnimatePresence>
  );
};
export default MainPage;
