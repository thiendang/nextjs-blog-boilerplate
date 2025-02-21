import { useState } from 'react';
import axios from 'axios';
import { Prisma } from '@prisma/client';
import prisma from 'lib/prisma';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

type Props = {
  profile: Prisma.UserCreateInput;
};

const Profile: React.FC<Props> = ({ profile }) => {
  const [avatar, setAvatar] = useState(undefined);
  const [avatarFile, setAvatarFile] = useState(undefined);
  const [progress, setProgress] = useState(0);

  const { data: session, status } = useSession();
  const loading = status === 'loading';

  const isEditable = session?.user?.username === profile?.username;

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) {
      return;
    }

    const file = event.target.files[0];
    setAvatar(URL.createObjectURL(file));
    setAvatarFile(file);
  };

  const handleUpload = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append('avatar', avatarFile);

    const config = {
      headers: { 'content-type': 'multipart/form-data' },
      onUploadProgress: (event: ProgressEvent) => {
        const _progress = Math.round((event.loaded * 100) / event.total);
        setProgress(_progress);
      },
    };

    try {
      await axios.post('/api/user/upload-avatar', formData, config);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form>
      <div>
        <input
          accept="image/*"
          multiple={false}
          name="avatar"
          onChange={handleChange}
          type="file"
        />
      </div>
      {avatar && <img src={avatar} style={{ height: '100px', width: '100px' }} />}
      {progress > 0 && progress}
      <button onClick={handleUpload}>Upload</button>
    </form>
  );
};

// getServerSideProps and prisma get user
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const router = useRouter();
  const username = params.username as string;

  const profile = await prisma.user.findUnique({
    where: { username },
  });

  if (!profile) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      profile: {
        ...profile,
        createdAt: profile.createdAt.toISOString(), // dates not seriazable but needed
        updatedAt: profile.updatedAt.toISOString(),
      },
    },
  };
};

export default Profile;
