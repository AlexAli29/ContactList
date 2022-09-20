import React, {useMemo, useState, useEffect} from "react";
import './styles/App.css'
import PostList from "./Components/PostList";
import MyButton from "./Components/UI/button/MyButton";
import PostForm from "./Components/PostForm";
import PostFilter from "./Components/PostFilter";
import MyModal from "./Components/UI/MyModal/MyModal";

function App() {   

    const [contacts, setContacts] = useState([]);
    const [listUpdateTrigger, setListUpdateTrigger] = useState({});
    const [editableContact, setEditableContact] = useState(null);


    useEffect(() => {
       
        fetch("/api/contacts")
            .then(response => response.json())
            .then((resp) => {
                let data = resp.map((item) => {
                    return {
                        id: item.id,
                        name: item.name,
                        jobTitle: item.jobTitle,
                        phone: item.mobilePhone,
                        birthDate: item.birthDate
                    };
                });
                setContacts(data)
            })
            .catch(console.error);

    }, [listUpdateTrigger]);

    const [filter,setFilter] = useState({sort:'', query:''});
    const [modal, setModal] =useState(false);

    const sortedContacts = useMemo(() =>{
        console.log('worked')
        if (filter.sort) {
            return [...contacts].sort((a,b) => a[filter.sort].localeCompare(b[filter.sort]))
        }
        return contacts;
    }, [filter.sort, contacts]);

    const sortedAndSearchedContacts = useMemo(() =>{
        return sortedContacts.filter(contacts => contacts.name.toLowerCase().includes(filter.query.toLowerCase()))
    },[filter.query,sortedContacts])


    const createContact = (newContact) =>{
        fetch("https://localhost:7015/api/contacts", {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(newContact)
        })
        .then(() => setListUpdateTrigger({}))
        .then(() => setModal(false));        
    }

    const removeContact = (contacId) =>{
        fetch(`https://localhost:7015/api/contacts/${contacId}`, {
            method: 'DELETE'
        })
            .then(() => setListUpdateTrigger({}));
    }

    const updateContact = (contacId) => {
        setModal(true)
        fetch(`https://localhost:7015/api/contacts/${contacId}`)
            .then((data) => data.json())
            .then((contact) => {
                setEditableContact(contact);                
            });        
    }

    useEffect(() => {
       
    }, [editableContact]);


  return (
    <div className="App">
        <MyButton style={{marginTop:30}} onClick={() => setModal(true)}>
            Add Contact
        </MyButton>
        <MyModal visible={modal} setVisible={setModal}>
            <PostForm
                  formTitle="Add Contact"
                  create={createContact}
                  editableContact={editableContact}
            />
        </MyModal>
        <hr style={{margin: '15px 0'}}/>
        <PostFilter
            filter={filter}
            setFilter={setFilter}
        />
          <PostList remove={removeContact} update={updateContact} contacts={sortedAndSearchedContacts} title="Contact list"/>
    </div>
  );
}

export default App;
