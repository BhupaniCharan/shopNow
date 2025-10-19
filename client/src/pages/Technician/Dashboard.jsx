import React from 'react';
import { useAppContext } from '../../context/AppContext';

const TechDashboard = () => {
  const { axios } = useAppContext();
  const [openRequests, setOpenRequests] = React.useState([]);
  const [myRequests, setMyRequests] = React.useState([]);

  const load = async () => {
    try {
      const [openRes, mineRes] = await Promise.all([
        axios.get('/api/requests/open/list'),
        axios.get('/api/technician/requests'),
      ]);
      if (openRes.data.success) setOpenRequests(openRes.data.requests);
      if (mineRes.data.success) setMyRequests(mineRes.data.requests);
    } catch {}
  };

  const claim = async (id) => {
    await axios.post(`/api/requests/${id}/claim`);
    await load();
  };

  const updateStatus = async (id, status) => {
    await axios.patch(`/api/requests/${id}/status`, { status });
    await load();
  };

  React.useEffect(() => { load(); }, []);

  return (
    <div className="max-w-5xl mx-auto py-6 grid gap-6">
      <section>
        <h2 className="text-xl font-semibold mb-2">Open Requests</h2>
        <div className="grid gap-2">
          {openRequests.map((r) => (
            <div key={r._id} className="border rounded p-3">
              <div className="font-medium">{r.category || 'Other'}</div>
              <div className="text-sm text-gray-600">{r.description}</div>
              <button onClick={() => claim(r._id)} className="mt-2 px-3 py-1 bg-primary text-white rounded">Claim</button>
            </div>
          ))}
          {openRequests.length === 0 && <div className="text-gray-600">No open requests.</div>}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">My Assigned Requests</h2>
        <div className="grid gap-2">
          {myRequests.map((r) => (
            <div key={r._id} className="border rounded p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{r.category || 'Other'}</div>
                  <div className="text-sm text-gray-600">{r.description}</div>
                </div>
                <div className="text-sm">Status: <span className="font-medium">{r.status}</span></div>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {["en_route","started","paused","completed","cancelled"].map((s) => (
                  <button key={s} onClick={() => updateStatus(r._id, s)} className="px-3 py-1 border rounded">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {myRequests.length === 0 && <div className="text-gray-600">No assigned requests.</div>}
        </div>
      </section>
    </div>
  );
};

export default TechDashboard;
