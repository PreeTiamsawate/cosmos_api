const axios = require('axios').default;

const testAxios = async () => {
    const url = 'https://vote.cosmos.starhunterent.com/clientapi/UpdateVoteLog';
    const data = {
        "userid": "62c6cf4f0771b93cb29f1e20",
        "username": "iammrugesh",
        "email": "mrugeshpatelcumulative@gmail.com",
        "token": 10,
        "point": 50,
        "candidate": "62a6a78bff9c10499b2145f4"
    };
    const headers = {
        'Content-Type': 'application/json',
        "key": '95182f700496d6c0a27d3bef6e3e6dac'
    }
    try {
        await axios.post(url, data, { headers: headers }).then(async (response) => {

            console.log(response)



        });
    }catch (e) {
        console.log(e)
    }

}
testAxios();