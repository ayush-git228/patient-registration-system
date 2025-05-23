export const patientFields = [
    { name: "name", label: "Full Name", type: "text", required: true, placeholder: "Enter full name" },
    { name: "email", label: "Email", type: "email", required: true , placeholder: "Enter email address (eg. abc@gmail.com)"},
    { name: "phone", label: "Phone", type: "text", required: true, placeholder: "Enter mobile no."},
    { name: "address", label: "Address", type: "text", required: true, placeholder: "Enter address"},
    { name: "dob", label: "Date of Birth", type: "date", required: true },
    { name: "gender", label: "Gender", type: "select", options: ["", "Female", "Male", "Other"], required: true, placeholder: "Select gender" },
];