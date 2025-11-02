// import { ApolloClient, InMemoryCache, HttpLink, NormalizedCacheObject } from '@apollo/client';
// import Cookies from "js-cookie"; // Only available on client
// import { protocol, RootApi } from '../config';
// import Swal from 'sweetalert2';


// export const isServer = () => typeof window === "undefined";

// const API_KEY = process.env.NEXT_PUBLIC_API_KEY



// export default function getApolloClient(
//   domain: string,
//   external?: boolean,
//   options?: { csrfToken?: string }
// ): ApolloClient<NormalizedCacheObject> {

//   const csrfToken = options?.csrfToken || (!isServer() ? Cookies.get("csrftoken") : "");

//   const uri = protocol + (external ? domain : ('api' + domain)) + RootApi + '/graphql/'

//   const headers: Record<string, string> = {
//     'Content-Type': 'application/json',
//     'X-API-KEY': API_KEY || "",
//     ...(csrfToken && { 'X-CSRFToken': csrfToken }),
//     Referer: protocol + (external ? domain : ('api' + domain)) + RootApi,
//   };

//   return new ApolloClient({
//     link: new HttpLink({
//       uri,
//       fetch,
//       headers,
//     }),
//     cache: new InMemoryCache(),
//     defaultOptions: {
//       mutate: { fetchPolicy: 'no-cache' },
//     },
//   });
// }


// export const errorLog = (err: any, show?: boolean) => {
//   let mes = "An unknown error occurred";

//   if (typeof err === "string") {
//     mes = err;
//   }

//   // GraphQL Errors
//   else if (err?.graphQLErrors?.length > 0) {
//     console.error("GraphQL Errors:", err.graphQLErrors);
//     mes = err.graphQLErrors.map((e: any) => e.message).join('\n');
//   }

//   // Network Errors (Apollo network error with result.errors[])
//   else if (err?.networkError) {
//     if ("result" in err.networkError) {
//       if (err?.networkError?.result?.errors?.length > 0) {
//         console.log("Network Error -> GraphQL errors:", err?.networkError?.result?.errors);
//         mes = err.networkError.result.errors.map((e: any) => e.message).join('\n');
//       }
//       else if (err?.networkError?.message) {
//         console.log("Network Error:", err.networkError.message);
//         mes = err.networkError.message;
//       }
//       else {
//         console.error("Apollo Network Error:", err.networkError);
//       }
//     }
//   }

//   // Extra Info fallback
//   else if (err?.extraInfo) {
//     console.error("Extra Info:", err.extraInfo);
//     mes = String(err.extraInfo);
//   }

//   // Plain error message
//   else if (err?.message) {
//     mes = err.message;
//   }

//   // Unknown error fallback
//   else {
//     console.error("Unhandled error:", err);
//   }

//   // SweetAlert show option
//   if (show) {
//     Swal.fire({
//       title: mes,
//       icon: 'error',
//       timer: 3000,
//       timerProgressBar: true,
//       showConfirmButton: false,
//     });
//   }

//   return mes;
// };