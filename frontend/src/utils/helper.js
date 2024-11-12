export const validateEmail = (email)=>{
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const getInitials = (name) => {
    if (!name) {
      console.log("Name is invalid or empty!"); // Log invalid name
      return '';
    }
    
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      // If the name contains only one part, just take the first letter
      return nameParts[0][0].toUpperCase();
    }
  
    // Otherwise, take the first letter of the first two name parts
    return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
  };
  
  