import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo_small_2.svg";

export default function Footer() {
  return (
    <div className="m-auto mt-8 flex w-full max-w-7xl flex-col items-start justify-start gap-10 bg-white">
      <div className="m-auto h-[0.05rem] w-full rounded bg-gray-200"></div>
      <div className="flex w-full flex-col items-start justify-between gap-6 py-4 md:flex-row md:items-start md:gap-16 md:py-16">
        <div className="flex flex-row items-center justify-start gap-10 ">
          <div className="flex w-full flex-col gap-2">
            <Image src={logo} alt="Kindi AI Logo" width={45} height={45} />
            <div className="flex flex-row gap-1 text-sm font-light text-gray-500">
              <Link className="hover:font-normal hover:text-gray-900" href="">
                Terms
              </Link>
              <Link className="hover:font-normal hover:text-gray-900" href="">
                Privacy policy
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start gap-2">
          <p className="text-md text-start font-normal text-gray-900 hover:font-normal hover:text-gray-900">
            Company
          </p>
          <Link
            href=""
            className="text-start text-sm font-light text-gray-600 hover:font-normal hover:text-gray-900"
          >
            Home
          </Link>
          <Link
            href=""
            className="text-start text-sm font-light text-gray-600 hover:font-normal hover:text-gray-900"
          >
            Pricing
          </Link>
          <Link
            href=""
            className="text-start text-sm font-light text-gray-600 hover:font-normal hover:text-gray-900"
          >
            About us
          </Link>
          <Link
            href=""
            className="text-sm font-light text-gray-600 hover:font-normal hover:text-gray-900"
          >
            Support center
          </Link>
        </div>
        <div className="flex flex-col items-start gap-2">
          <p className="text-md text-start font-normal text-gray-900">
            Contact us
          </p>
          <p className="text-sm font-light text-gray-600">
            Send us an email at
          </p>

          <p className="text-sm font-semibold text-gray-900">
            support@kindiai.com
          </p>
        </div>
        <div className="flex max-w-xs flex-col items-start gap-2">
          <p className="text-md text-start font-normal text-gray-900">
            Subscribe
          </p>
          <p className="text-sm font-light text-gray-600">
            Get the latest news and blog articles about Kindi AI to your inbox.
          </p>

          <form className="w-full">
            <div className=" flex w-full flex-wrap">
              <div className="w-full">
                <div className="relative flex  max-w-xs items-center rounded border  border-gray-700">
                  <input
                    id="newsletter"
                    type="email"
                    className="w-full border-solid px-3 py-2 pr-12 text-xs font-light text-gray-800"
                    placeholder="Your email"
                    required
                  />
                  <button
                    type="submit"
                    className="absolute inset-0 left-auto"
                    aria-label="Subscribe"
                  >
                    <span
                      className="absolute inset-0 right-auto my-2 -ml-px w-px bg-gray-300"
                      aria-hidden="true"
                    ></span>
                    <svg
                      className="mx-3 h-3 w-3 shrink-0 fill-current text-primary"
                      viewBox="0 0 12 12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z"
                        fillRule="nonzero"
                      />
                    </svg>
                  </button>
                </div>
                <p className="mt-2 text-sm text-green-600">
                  Thanks for subscribing!
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="m-auto h-[0.05rem] w-full rounded bg-gray-200"></div>
      <div className="flex w-full flex-col-reverse items-center justify-between gap-2 md:flex-row">
        <p className="text-sm font-light text-gray-600">
          &copy; Kindi.ai. All rights reserved.
        </p>
        <ul className="mb-4 flex md:order-1 md:mb-0 md:ml-4">
          <li>
            <a
              href="https://twitter.com/PlasticDB"
              className="hover:bg-white-100 flex items-center justify-center rounded-full bg-white text-gray-600 shadow transition duration-150 ease-in-out hover:text-gray-900"
              aria-label="Twitter"
              target="_blank"
            >
              <svg
                className="h-8 w-8 fill-current"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M24 11.5c-.6.3-1.2.4-1.9.5.7-.4 1.2-1 1.4-1.8-.6.4-1.3.6-2.1.8-.6-.6-1.5-1-2.4-1-1.7 0-3.2 1.5-3.2 3.3 0 .3 0 .5.1.7-2.7-.1-5.2-1.4-6.8-3.4-.3.5-.4 1-.4 1.7 0 1.1.6 2.1 1.5 2.7-.5 0-1-.2-1.5-.4 0 1.6 1.1 2.9 2.6 3.2-.3.1-.6.1-.9.1-.2 0-.4 0-.6-.1.4 1.3 1.6 2.3 3.1 2.3-1.1.9-2.5 1.4-4.1 1.4H8c1.5.9 3.2 1.5 5 1.5 6 0 9.3-5 9.3-9.3v-.4c.7-.5 1.3-1.1 1.7-1.8z" />
              </svg>
            </a>
          </li>
          <li className="ml-4">
            <a
              href="https://www.instagram.com/plastic_db/"
              target="_blank"
              className="hover:bg-white-100 flex items-center justify-center rounded-full bg-white text-gray-600 shadow transition duration-150 ease-in-out hover:text-gray-900"
              aria-label="Instagram"
            >
              <svg
                className="h-8 w-8 fill-current"
                viewBox="-8 -8 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
              </svg>
            </a>
          </li>
          <li className="ml-4">
            <a
              href="https://www.facebook.com/people/Plasticdb/100092660842776/"
              className="hover:bg-white-100 flex items-center justify-center rounded-full bg-white text-gray-600 shadow transition duration-150 ease-in-out hover:text-gray-900"
              aria-label="Facebook"
              target="_blank"
            >
              <svg
                className="h-8 w-8 fill-current"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M14.023 24L14 17h-3v-3h3v-2c0-2.7 1.672-4 4.08-4 1.153 0 2.144.086 2.433.124v2.821h-1.67c-1.31 0-1.563.623-1.563 1.536V14H21l-1 3h-2.72v7h-3.257z" />
              </svg>
            </a>
          </li>
          <li className="ml-4">
            <a
              href="https://www.linkedin.com/company/plasticdb"
              className="hover:bg-white-100 flex items-center justify-center rounded-full bg-white text-gray-600 shadow transition duration-150 ease-in-out hover:text-gray-900"
              aria-label="LinkedIn"
              target="_blank"
            >
              <svg
                className="h-8 w-8 fill-current"
                viewBox="-8 -8 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 5h3.578v11H0zM13.324 5.129c-.038-.012-.074-.025-.114-.036a2.32 2.32 0 0 0-.145-.028A3.207 3.207 0 0 0 12.423 5c-2.086 0-3.409 1.517-3.845 2.103V5H5v11h3.578v-6s2.704-3.766 3.845-1v7H16V8.577a3.568 3.568 0 0 0-2.676-3.448z"></path>
                <circle cx="1.75" cy="1.75" r="1.75"></circle>
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
