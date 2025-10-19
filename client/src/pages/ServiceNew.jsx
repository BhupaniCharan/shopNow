import React from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const ServiceNew = () => {
  const { axios, navigate } = useAppContext();
  const [description, setDescription] = React.useState("");
  const [deviceType, setDeviceType] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [preferredTime, setPreferredTime] = React.useState("");
  const [suggestion, setSuggestion] = React.useState(null);

  const getSuggestion = async () => {
    try {
      const { data } = await axios.post('/api/requests/suggest', {
        description,
        deviceType,
      });
      if (data.success) setSuggestion(data.suggestion);
    } catch (error) {
      // ignore for prototype
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/requests', {
        description,
        deviceType,
        address,
        preferredTime,
      });
      if (data.success) {
        toast.success('Service request created');
        navigate(`/service/${data.request._id}`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  React.useEffect(() => {
    if (description || deviceType) {
      getSuggestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [description, deviceType]);

  return (
    <div className="max-w-2xl mx-auto py-6">
      <h2 className="text-2xl font-semibold mb-4">Create Service Request</h2>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div>
          <label className="block mb-1">Device Type</label>
          <input value={deviceType} onChange={(e)=>setDeviceType(e.target.value)} className="border border-gray-300 rounded w-full p-2" placeholder="e.g. AC, TV, Washing Machine" />
        </div>
        <div>
          <label className="block mb-1">Problem Description</label>
          <textarea value={description} onChange={(e)=>setDescription(e.target.value)} className="border border-gray-300 rounded w-full p-2" rows={4} placeholder="Describe the issue" />
        </div>
        <div>
          <label className="block mb-1">Service Address</label>
          <input value={address} onChange={(e)=>setAddress(e.target.value)} className="border border-gray-300 rounded w-full p-2" placeholder="Address" />
        </div>
        <div>
          <label className="block mb-1">Preferred Time</label>
          <input type="datetime-local" value={preferredTime} onChange={(e)=>setPreferredTime(e.target.value)} className="border border-gray-300 rounded w-full p-2" />
        </div>

        {suggestion && (
          <div className="p-3 bg-green-50 border border-green-200 rounded text-sm">
            <div><span className="font-medium">Suggested Category:</span> {suggestion.category}</div>
            <div><span className="font-medium">Estimated Duration:</span> {suggestion.estimatedDurationMinutes} mins</div>
          </div>
        )}

        <button type="submit" className="bg-primary hover:bg-primary-dull text-white px-4 py-2 rounded">Submit Request</button>
      </form>
    </div>
  );
};

export default ServiceNew;
