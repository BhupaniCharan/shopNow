import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const ServiceDetail = () => {
  const { id } = useParams();
  const { axios } = useAppContext();
  const [request, setRequest] = React.useState(null);

  const load = async () => {
    try {
      const { data } = await axios.get(`/api/requests/${id}`);
      if (data.success) setRequest(data.request);
    } catch {}
  };

  React.useEffect(() => { load(); }, [id]);

  if (!request) return <div className="max-w-3xl mx-auto py-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h2 className="text-2xl font-semibold mb-1">{request.category || 'Other'}</h2>
      <div className="text-gray-700 mb-2">{request.description}</div>
      <div className="text-sm text-gray-600 mb-4">Address: {request.address}</div>
      <div className="text-sm text-gray-600 mb-4">Status: <span className="font-medium">{request.status}</span></div>
      <div className="text-sm text-gray-600 mb-4">Estimated Duration: {request.estimatedDurationMinutes} mins</div>

      <div>
        <h3 className="font-medium mb-2">Technician Updates</h3>
        <ul className="space-y-2">
          {request.updates?.slice().reverse().map((u, idx) => (
            <li key={idx} className="border rounded p-2">
              <div className="text-xs text-gray-500">{new Date(u.at).toLocaleString()} - {u.status}</div>
              {u.message && <div>{u.message}</div>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ServiceDetail;
