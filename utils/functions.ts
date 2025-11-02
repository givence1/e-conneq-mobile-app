
import { Alert, Linking } from "react-native";


export const decodeUrlID = (urlID: string) => {
    try {
        const base64DecodedString = decodeURIComponent(urlID); // Decodes %3D%3D to ==
        const decoded = atob(base64DecodedString);
        return decoded.split(":")[1];
    } catch (error) {
        console.error("Error decoding ID:", error);
        return null;
    }

    // const id = Buffer.from(base64DecodedString, 'base64').toString('utf-8'); // Decoding from base64
    // return id.split(":")[1]
}

export const capitalizeFirstLetter = (str: string) => {
    if (!str) return ''; // Handle empty strings
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}


export const capitalizeEachWord = (str: string) => {
  if (!str) return ''; // Handle empty or null strings
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};



export const removeEmptyFields = (obj: any) => {
  const newObj: any = {};
  for (const key in obj) {
    // Keep File objects and non-empty values
    if (obj[key] instanceof File || 
        (obj[key] !== null && obj[key] !== undefined && obj[key] !== '')) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
};

export const removeUnderscoreKeys = (obj: any) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !key.startsWith("__"))
  );
}


export const validateDate = (dateString: string): { isValid: boolean; error?: string } => {
  if (!dateString || dateString.length !== 10) {
    return { isValid: false, error: 'Invalid date format' };
  }
  
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    return { isValid: false, error: 'Invalid date format' };
  }
  
  const parts = dateString.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  
  const currentYear = new Date().getFullYear();
  
  if (year < currentYear) {
    return { isValid: false, error: 'Year cannot be in the past' };
  }
  
  if (month < 1 || month > 12) {
    return { isValid: false, error: 'Month must be between 01-12' };
  }
  
  if (day < 1 || day > 31) {
    return { isValid: false, error: 'Day must be between 01-31' };
  }
  
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day > daysInMonth) {
    return { isValid: false, error: `Invalid day for ${month}/${year}` };
  }
  
  return { isValid: true };
};




export const handleSupport = () => {
  const phoneNumber = "237673351854";
  const message = "Hello, I need help resetting my password.";
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  Linking.openURL(url);
};





export const errorLog = (err: any, show?: boolean) => {
  let mes = "An unknown error occurred";

  if (typeof err === "string") {
    mes = err;
  }

  // GraphQL Errors
  else if (err?.graphQLErrors?.length > 0) {
    console.error("GraphQL Errors:", err.graphQLErrors);
    mes = err.graphQLErrors.map((e: any) => e.message).join('\n');
  }

  // Network Errors (Apollo network error with result.errors[])
  else if (err?.networkError) {
    if ("result" in err.networkError) {
      if (err?.networkError?.result?.errors?.length > 0) {
        console.log("Network Error -> GraphQL errors:", err?.networkError?.result?.errors);
        mes = err.networkError.result.errors.map((e: any) => e.message).join('\n');
      }
      else if (err?.networkError?.message) {
        console.log("Network Error:", err.networkError.message);
        mes = err.networkError.message;
      }
      else {
        console.error("Apollo Network Error:", err.networkError);
      }
    }
  }

  // Extra Info fallback
  else if (err?.extraInfo) {
    console.error("Extra Info:", err.extraInfo);
    mes = String(err.extraInfo);
  }

  // Plain error message
  else if (err?.message) {
    mes = err.message;
  }

  // Unknown error fallback
  else {
    console.error("Unhandled error:", err);
  }

  // SweetAlert show option
  if (show) {
    // Swal.fire({
    //   title: mes,
    //   icon: 'error',
    //   timer: 3000,
    //   timerProgressBar: true,
    //   showConfirmButton: false,
    // });
  }

  return mes;
};


export const actionSubmit = async (data: any, url: string) => {
  console.log(data);
  console.log(url);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log(result);

    if (result?.errors) {
      Alert.alert("Error", JSON.stringify(result.errors));
      return;
    }

    if (result?.email?.length) {
      Alert.alert("Error", result.email[0]);
      return;
    }

    if (result?.error) {
      if (JSON.stringify(result.error).includes("(535, b'Incorrect authentication data')")) {
        return "An Error Occurred";
      }
      return JSON.stringify(result?.error);
    }
    return result

  } catch (err: any) {
    return err;
  }
};


export function getAcademicYear(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0 = January, 7 = August

    if (month < 7) {
        return `${year - 1}/${year}`;
    } else {
        return `${year}/${year + 1}`;
    }
}


export function getISOWeek(date: any) {
  const tmp: any = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum: any = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
  const yearStart: any = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  return Math.ceil(((tmp - yearStart) / 86400000 + 1) / 7);
}

// W40-2025
export const getWeekRange = (weekNo: number, year: number) => {
    if (!weekNo) return [];
    var a = ((weekNo - 1) * 7);
    var mon = new Date(year, 0, a)
    var tue = new Date(mon.getTime() + 1 * 24 * 60 * 60 * 1000)
    var wed = new Date(mon.getTime() + 2 * 24 * 60 * 60 * 1000)
    var thu = new Date(mon.getTime() + 3 * 24 * 60 * 60 * 1000)
    var fri = new Date(mon.getTime() + 4 * 24 * 60 * 60 * 1000)
    var sat = new Date(mon.getTime() + 5 * 24 * 60 * 60 * 1000)
    var sun = new Date(mon.getTime() + 6 * 24 * 60 * 60 * 1000)
    return [
        mon.toISOString().slice(0, 10),
        tue.toISOString().slice(0, 10),
        wed.toISOString().slice(0, 10),
        thu.toISOString().slice(0, 10),
        fri.toISOString().slice(0, 10),
        sat.toISOString().slice(0, 10),
        sun.toISOString().slice(0, 10),
    ];
}


// 2025-10-29 Format date like: "Friday, 28th October 2025"
export const formatDateWithSuffix = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.getDate();

  // Compute suffix
  const suffix = day > 3 && day < 21 ? "th" : (() => {
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  })();

  // Get weekday, month, year
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const year = date.getFullYear();

  // Combine as "Friday, 28th October 2025"
  return `${weekday}, ${day}${suffix} ${month} ${year}`;
};