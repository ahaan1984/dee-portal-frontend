const ContactUs = () => {
  return (
    <div className="bg-white p-6">
      {/* Main Heading */}
      <h1 className="text-2xl font-bold mb-4">Contact Us</h1>

      {/* Primary Contact Details */}
      <div className="border-b pb-4 mb-6">
        <h2 className="text-lg font-bold text-blue-600">Dr. Om Prakash, IAS</h2>
        <p className="text-gray-700">Mission Director</p>
        <p>Samagra Shiksha Axom, Kahilipara, Guwahati- 781 019, ASSAM</p>
        <p>Email: <a href="mailto:ssaassam@rediffmail.com" className="text-blue-500 underline">ssaassam@rediffmail.com</a></p>
        <p>Phone: 0361-2386452</p>
        <p>For Public Grievances, Toll-Free Number: <span className="text-red-500">1800-345-3525</span></p>
      </div>

      {/* Whom to Contact For */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">Whom to Contact for:</h3>
        <div className="flex items-start space-x-6">
          <div>
            <h4 className="font-bold">General Administration/Grievance/RTI</h4>
            <p>Name: Sri Sanjoy Dutta, ACS</p>
            <p>Designation: Executive Director</p>
            <p>Email: <a href="mailto:ssaassam@rediffmail.com" className="text-blue-500 underline">ssaassam@rediffmail.com</a></p>
            <p>Phone: 0361-2380701, 2380144, 2383803</p>
            <p>Address: Office of the Mission Director, Samagra Shiksha Axom, Kahilipara, Guwahati- 781 019, ASSAM</p>
          </div>
          <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
        </div>
      </div>

      {/* Other Offices */}
      <div className="flex">
        {/* Left Section */}
        <div className="w-2/3">
          <h4 className="font-bold mb-2">Other Offices</h4>
          <ul className="list-disc ml-5 text-red-500">
            <li>Baksa</li>
            <li>Barpeta</li>
            <li>Biswanath Chariali</li>
            <li>Bongaigaon</li>
            <li>Cachar</li>
            <li>... More Districts ...</li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="w-1/3 text-sm">
          <h4 className="font-bold mb-2">Accounts/CPF</h4>
          <p>Name: Smt. Daisy Nath, AFS</p>
          <p>Designation: Chief Accounts Officer</p>
          <p>Email: <a href="mailto:ssaassam@rediffmail.com" className="text-blue-500 underline">ssaassam@rediffmail.com</a></p>
          <p>Phone: 0361-2380701, 2380144, 2383803</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
