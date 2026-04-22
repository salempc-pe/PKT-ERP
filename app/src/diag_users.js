import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

export async function diagUsers() {
  const usersSnap = await getDocs(collection(db, 'users'));
  const users = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  console.log("DIAG: Total users in DB:", users.length);
  users.forEach(u => {
    console.log(`- ${u.email} | Org: ${u.organizationId} | Status: ${u.status} | Role: ${u.role}`);
  });
  return users;
}
