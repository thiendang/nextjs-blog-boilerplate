import { useState } from 'react';
import axios from 'axios';

const SignUp: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const body = {
        name,
        email,
        password,
      };
      await fetch('/api/user/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const formData = new FormData();

    Array.from(e.target.files).forEach((file) => {
      formData.append(e.target.name, file);
    });

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: ProgressEvent) => {
        console.log(
          'Upload progress: ' +
            Math.round((progressEvent.loaded / progressEvent.total) * 100) +
            '%'
        );
      }
    }

    await axios.post('/api/upload-avatar', formData, config);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          type="name"
          name="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="name">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="name">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <input
          accept="image/*"
          multiple={false}
          name="avatar"
          onChange={handleUpload}
          type="file"
        />
      </div>
      <input type="submit" value="Sign up" />
    </form>
  );
};
export default SignUp;