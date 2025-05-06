export default function FlagDisplay({ flag }) {
    return (
      <div className="w-80 h-48 mb-6 shadow-lg overflow-hidden rounded-lg">
        {/* Display the flag image */}
        <img src={flag}
             alt="Country flag"
             className="object-cover w-full h-full" />
      </div>
    );
  }
  