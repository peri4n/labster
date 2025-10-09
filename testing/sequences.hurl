# Test for creating multiple sequences in the database
POST http://localhost:3000/sequences
[
{
    "identifier": "id1",
    "alphabet": "dna",
    "description": "Sample sequence 1",
    "sequence": "ATCGATCGATCGATCGATCGATCGATCGATCG"
},
{
    "identifier": "id2",
    "alphabet": "dna",
    "description": "Sample sequence 2",
    "sequence": "AGCTAGCTAGCTAGCTAGCTAGCTAGCTAGCTA"
}
]
HTTP 201
[Asserts]
jsonpath "$" == 2
