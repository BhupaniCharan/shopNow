import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

const ServiceList = () => {
  const { axios } = useAppContext();
  const [requests, setRequests] = React.useState([]);

  const load = async () => {
    try {
      const { data } = await axios.get('/api/requests');
      if (data.success) setRequests(data.requests);
    } catch {}
  };

  React.useEffect(() => { load(); }, []);

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">My Service Requests</h2>
        <Link to="/service/new" className="px-3 py-2 bg-primary text-white rounded">New Request</Link>
      </div>
      <div className="grid gap-3">
        {requests.map((r) => (
          <Link key={r._id} to={`/service/${r._id}`} className="border rounded p-3 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{r.category || 'Other'}</div>
                <div className="text-sm text-gray-600">{r.description}</div>
              </div>
              <div className="text-sm">Status: <span className="font-medium">{r.status}</span></div>
            </div>
          </Link>
        ))}
        {requests.length === 0 && (
          <div className="text-gray-600">No requests yet.</div>
        )}
      </div>
    </div>
  );
};

export default ServiceList;
