from unittest.mock import patch


@patch("main.get_tailored_results")
def test_tailor_cv_success(mock_get_results, api_client, valid_payload):
    mock_get_results.return_value = (
        "success",
        "Tailored text",
        90,
        ["Skill 1"],
    )

    response = api_client.post(
        "/tailor",
        files=valid_payload["files"],
        data=valid_payload["data"],
    )

    assert response.status_code == 200
    assert response.json()["match_score"] == 90


def test_tailor_cv_missing_file(api_client):
    response = api_client.post(
        "/tailor",
        data={"job_url": "https://example.com/job-offer"},
    )

    assert response.status_code == 422
    