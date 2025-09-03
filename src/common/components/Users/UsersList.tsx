import { useEffect, useState } from 'react';

import type { User } from '@/common/types/types';
import styled from 'styled-components';

const UsersContainer = styled.div`
  margin-top: 2rem;
  width: 100%;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const UserCard = styled.div`
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const UserInfo = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const UserName = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const UserEmail = styled.p`
  margin: 0;
  color: #666;
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  padding: 1rem;
  text-align: center;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 1rem;
`;

// TODO: Students in Discover Program will likely need to edit this User schema to fit
// the needs of their project.

export default function UsersList() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        console.log("fetching users from fetchUsers with token", token)
        const response = await fetch(
          `${backendUrl}/auth/users`,
          {
            credentials: 'include',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data);
        console.log('userData', data);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <LoadingMessage>Loading users...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>Error: {error}</ErrorMessage>;
  }

  return (
    <UsersContainer>
      {users &&
        users.map((user: User) => (
          <UserCard key={user.email}>
            <UserInfo>
              <div>
                <UserName>
                  {user.firstName} {user.lastName} (
                  {user.username || 'No username'})
                </UserName>
                <UserEmail>{user.email}</UserEmail>
              </div>
            </UserInfo>
          </UserCard>
        ))}
    </UsersContainer>
  );
}
