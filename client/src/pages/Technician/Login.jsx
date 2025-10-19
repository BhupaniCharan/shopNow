import React from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const TechLogin = () => {
  const { axios, navigate } = useAppContext();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/technician/login', { email, password });
      if (data.success) {
        toast.success('Technician logged in');
        navigate('/tech');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={submit} className="min-h-screen flex items-center">
      <div className="m-auto border rounded p-6 shadow w-80">
        <h2 className="text-xl font-semibold mb-3">Technician Login</h2>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" type="email" className="border rounded w-full p-2 mb-2" />
        <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" type="password" className="border rounded w-full p-2 mb-3" />
        <button type="submit" className="bg-primary text-white rounded px-3 py-2 w-full">Login</button>
      </div>
    </form>
  );
};

export default TechLogin;
